# typescript-okf

A small TypeScript agent that answers questions by reading a local **Open
Knowledge Format (OKF)** knowledge base — a folder of Markdown files with
YAML frontmatter — instead of relying purely on what the LLM learned during
training.

It talks to an LLM through [OpenRouter](https://openrouter.ai/) and gives the
model a single tool, `read_knowledge_base_document`, that lets it open
Markdown documents from the knowledge base on its own, following links
between documents the same way a person would browse a wiki.

## How it works

1. **`src/app.ts`** is the entry point. It calls `management_agent(...)`
   with a question.
2. **`src/agents.ts`** builds the agent: it loads the system prompt from
   [src/prompts/system_prompt.md](src/prompts/system_prompt.md), lists the
   available knowledge bases, and injects them into the prompt.
3. **`src/openrouter.ts`** (`call_llm`) drives the conversation with the
   model (currently `google/gemini-3-flash-preview` via OpenRouter):
   - It generates a strict JSON schema for the expected response type
     (from [src/model.ts](src/model.ts)) using `typescript-json-schema`, and
     asks the model to reply in that schema.
   - If the model requests a tool call, the requested tool
     (`read_okf_tool` in [src/tools/okf_tools.ts](src/tools/okf_tools.ts))
     is executed and its result is fed back to the model.
   - This repeats (up to `MAX_TURNS`) until the model returns a final
     answer instead of another tool call.
4. **`src/knowledgebases/okf.ts`** implements the knowledge base access:
   - `listKnowledgeBases()` scans a root folder for subfolders (each one
     knowledge base) and reads each one's `index.md`.
   - `read_knowledge()` reads and parses a specific Markdown document
     (frontmatter + content) from a given knowledge base, which is what the
     `read_knowledge_base_document` tool calls under the hood.

In short: the app asks a question, hands the LLM a map of available
knowledge bases, and lets the LLM decide which documents to open (via tool
calls) until it has enough information to answer.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and npm
- An [OpenRouter](https://openrouter.ai/) API key

## Installation

```bash
npm install
```

## Configuration

### 1. OpenRouter API key

The app reads the key from the `OPENROUTER_API_KEY` environment variable
(see [src/openrouter.ts](src/openrouter.ts)).

PowerShell:

```powershell
$env:OPENROUTER_API_KEY = "sk-or-..."
```

bash:

```bash
export OPENROUTER_API_KEY="sk-or-..."
```

### 2. Knowledge base location

Knowledge bases live in [data/knowledge_bases/](data/knowledge_bases/), a
path set in [src/knowledgebases/okf.ts](src/knowledgebases/okf.ts):

```ts
const KNOWLEDGE_DATABASES = "data/knowledge_bases";
```

Each subfolder under this path is treated as one knowledge base and must
contain an `index.md` file (with optional YAML frontmatter) describing its
contents and how to navigate it. Add more knowledge bases by dropping
another such folder in here, or point `KNOWLEDGE_DATABASES` elsewhere.

Bundled knowledge base:

- **`european-countries`** — capitals, population, and neighbouring
  countries for 44 European countries, organized by sub-region
  (western/northern/southern/southeastern/eastern Europe).

## Running

```bash
npm start
```

This runs [src/app.ts](src/app.ts) with `tsx`, which asks the agent a sample
question and prints the answer to the console.

## Building

To type-check and transpile to `dist/`:

```bash
npm run build
```

## Project structure

```
src/
  app.ts                  entry point / demo query
  agents.ts                assembles the system prompt + tools into an agent
  model.ts                  response type(s) sent to the LLM as a JSON schema
  openrouter.ts             LLM call loop (OpenRouter client, tool-call handling)
  prompts/system_prompt.md  system prompt describing the agent's rules
  knowledgebases/okf.ts      reads/lists OKF knowledge bases from disk
  tools/tools.ts             generic tool definition type
  tools/okf_tools.ts         tool that lets the LLM read a knowledge base document
data/
  knowledge_bases/           OKF knowledge bases (e.g. european-countries)
```
