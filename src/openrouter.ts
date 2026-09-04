
import {OpenRouter} from '@openrouter/sdk';
import { SendChatCompletionRequestResponse } from '@openrouter/sdk/models/operations';
import * as TJS from "typescript-json-schema";
import { resolve } from "path";
import { read_knowledge } from './knowledgebases/okf';
import { ChatMessages, ChatResult, ChatToolCall, ChatToolMessage } from '@openrouter/sdk/models';
import { ToolDefinition } from './tools/tools';
import { withTrace, withTraceRequest } from './observability/otel';

// const model = "openai/gpt-4o-mini"; // doesn't follows rules in the okf files+system prompt.
// const model = "google/gemini-3-flash-preview"; // good but structured output fails often
const model = "google/gemini-3.5-flash"
// const model = "qwen/qwen3.8-27b"; // doesn't work at all
const TEMPERATURE = 0.1;
const MAX_TURNS=20;


export const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});
const send_chat_request = withTrace("ChatRequest "+model, withTraceRequest(client.chat.send.bind(client.chat)));

export class LLMError extends Error {
}

export class ToolCallError extends LLMError {  
}

export function generateJsonSchema(typename: string): TJS.Definition {
    const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
    };
    const program = TJS.getProgramFromFiles(
        [resolve("src/model.ts")],
        compilerOptions,
        "./src",
    );
    let schema =TJS.generateSchema(program, typename, {
        required: true,
        ref: false,
    });
    if (schema) {
        schema.additionalProperties = false;
        return schema;
    } else {
        throw new Error("Failed to generate schema");
    }
}

export async function call_llm<Type>(systemprompt: string, prompt: string, output_typename: string, tools: Array<ToolDefinition> = []): Promise<Type> {
    const my_schema = generateJsonSchema(output_typename);

    let interrupted: boolean = false;
    let turns: number = 0;
    const tools_schemas = tools.map((t) => t.schema);

    let messages: ChatMessages[] = [
        { role: "system", content: systemprompt },
        { role: "user", content: prompt }
    ];

    while (!interrupted && turns < MAX_TURNS) {

        const response: SendChatCompletionRequestResponse = await send_chat_request({
            chatRequest: {
                model: model,
                messages: messages,
                temperature: TEMPERATURE,
                responseFormat: {
                    type: "json_schema",
                    jsonSchema: {
                        name: output_typename,
                        strict: true,
                        schema: my_schema
                    }
                },
                tools: tools_schemas,
                toolChoice: "auto", // Automatically choose a tool
            },
        });
        console.log("response:", response);
        console.log("deciding on action....");
        if (!("choices" in response)) {
            throw new LLMError("Expected a non-streaming chat completion response");
        }
        const response_message = response.choices[0].message;

        messages.push(response_message);
        const finishReason = response.choices[0].finishReason;
        console.log(`finish reason ${finishReason}`);
        if (finishReason == "tool_calls") {
            const tool_calls = response_message.toolCalls;
            if (tool_calls) {
                for (const tool of tool_calls) {

                    try {
                        const tool_executor = withTrace(`execute tool call: ${tool.function.name}`, execute_tool_call);
                        const tool_response = tool_executor(tools, tool);
                        messages.push(tool_response);
                    } catch (error) {
                        console.log(`error while calling tool: ${error}`);
                        messages.push({
                            role: "tool",
                            content: `Error while trying to call tool: ${error instanceof Error ? error.message : String(error)}`,
                            toolCallId: tool.id,
                        });
                    }
                }
            }

        } else if (finishReason == "stop") {
            if (typeof response_message.content !== "string") {
                throw new LLMError("Expected the LLM response content to be a JSON string");
            }
            const parsedResponse = JSON.parse(response_message.content);
            console.log("parsedResponse:", parsedResponse);
            return parsedResponse;
        } else {
            throw new LLMError("unhandled finishReason:" + finishReason)
        }
    }
    if (turns >= MAX_TURNS) {
        throw new LLMError("Max Turns reached");
    } else if (interrupted) {
        throw new LLMError("interrupted");
    } else {
        throw new LLMError("unexpected exit from LLM call turns");
    }
}

function execute_tool_call(available_tools: Array<ToolDefinition>, tool: ChatToolCall): ChatToolMessage {
    console.log("executing tool call")

    if (tool.type == "function") {
        console.log(tool.function);
        const tool_def = available_tools.find(t => tool.function.name == t.name);
        console.log(`tool definition: ${tool_def}`);
        if (tool_def) {
            const args = JSON.parse(tool.function.arguments);
            console.log(`tool args: ${args.knowledge_base} ${args.document_name} `);
            const result = tool_def.callback({ ...args });
            //         console.log(`EXECUTED TOOL_CALL: ${tool.function.name} args: ${args} returns: ${result}`);
            return {
                role: "tool",
                content: JSON.stringify(result),
                toolCallId: tool.id,
            } as ChatToolMessage;
        } else {
            throw new ToolCallError("Error, there is not tool with the name: ${tool.function.name}");
        }
    } else {
        throw new LLMError("tool type ${tool.type} not supported");
    }
}

