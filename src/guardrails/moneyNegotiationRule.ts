import type { GuardrailRule, RuleVerdict } from "./types";

/**
 * Cheap, fast pre-filter. Its only job is to decide whether the (much more
 * expensive, higher-latency) LLM judge is worth calling at all. It is
 * intentionally over-inclusive — false positives here just cost one extra
 * judge call; false negatives here mean the rule never fires, which is the
 * expensive mistake.
 */
const PRICE_PATTERNS: RegExp[] = [
  /[$€£¥]\s?\d[\d,.]*/g, // "$1,200", "€99"
  /\b\d[\d,.]*\s?(usd|eur|gbp|dollars?|euros?|pounds?)\b/gi,
  /\b(price|pricing|quote|cost|fee|discount|invoice|budget)\b/gi,
  /\b(negotiate|negotiation|lower the price|best (?:price|deal|offer)|meet you halfway|counter[- ]?offer)\b/gi,
];

function heuristicScan(text: string): FlaggedSpan[] {
  const spans: FlaggedSpan[] = [];
  for (const pattern of PRICE_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      if (match.index === undefined) continue;
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        reason: "keyword/pattern match",
      });
    }
  }
  return spans;
}

const JUDGE_INSTRUCTIONS = `You are a compliance classifier for an AI assistant's outgoing message.
Decide whether the text does ANY of the following:
1. States a concrete price, quote, discount, or fee.
2. Negotiates, haggles, or discusses adjusting a price/deal with the user.
3. Invites or continues a conversation about pricing/negotiation (e.g. "what's your budget?", "I can offer you a better rate").

General discussion of a product or service with NO price/negotiation content does not count.
Mentioning a non-monetary "cost" (e.g. "the cost to your health") does not count.

Return triggered=true only if the text itself (not just a keyword) is actually about pricing/negotiation.
For every flagged portion, return the exact character start/end offsets into the provided text.`;

/**
 * Rule: flag any part of the response that discusses money, quotes a price,
 * or engages in negotiation. On trigger, the flagged spans are redacted
 * from what the user sees, and a full (unredacted) copy is escalated to a
 * human-in-the-loop channel asynchronously.
 */
export function createMoneyNegotiationRule(judge: LlmJudge): GuardrailRule {
  return {
    id: "money-negotiation",
    description:
      "Detects prices, quotes, or price negotiation in the model's output; redacts and escalates to a human.",

    async evaluate(context: EvalContext): Promise<RuleVerdict> {
      const text = context.candidateText;
      const heuristicSpans = heuristicScan(text);

      if (heuristicSpans.length === 0) {
        // Nothing even superficially price-shaped — skip the judge call
        // entirely. This is the main latency/cost win of the two-stage design.
        return {
          ruleId: "money-negotiation",
          triggered: false,
          severity: "low",
          confidence: 1,
          spans: [],
          rationale: "no price/negotiation patterns found",
          action: "flag_only",
        };
      }

      // Something looked price-shaped — confirm semantically with the judge
      // so we don't redact e.g. "the emotional cost of this decision".
      const verdict = await judge.classify({ instructions: JUDGE_INSTRUCTIONS, text });

      if (!verdict.triggered) {
        return {
          ruleId: "money-negotiation",
          triggered: false,
          severity: "low",
          confidence: verdict.confidence,
          spans: [],
          rationale: `heuristic matched but judge did not confirm: ${verdict.rationale}`,
          action: "flag_only",
        };
      }

      const spans: FlaggedSpan[] =
        verdict.spans.length > 0
          ? verdict.spans.map((s) => ({
              start: s.start,
              end: s.end,
              text: text.slice(s.start, s.end),
              reason: "llm-judge confirmed",
            }))
          : heuristicSpans; // fallback: judge confirmed but gave no offsets

      return {
        ruleId: "money-negotiation",
        triggered: true,
        severity: verdict.confidence >= 0.8 ? "high" : "medium",
        confidence: verdict.confidence,
        spans,
        rationale: verdict.rationale,
        action: "redact",
      };
    },
  };
}
