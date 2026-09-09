
export type Severity = "low" | "medium" | "high";

/** The result of a single rule evaluating one piece of text. */
export interface RuleVerdict {
  ruleId: string;
  passed: boolean;
  severity: Severity;
  /** 0..1 confidence from whatever detector produced this verdict. */
  confidence: number;
  /** Short human-readable explanation, surfaced to the HITL reviewer. */
  rationale: string;
}

export interface GuardrailRule {
  id: string;
  description: string;
  evaluate(context: string): Promise<RuleVerdict>;
}
