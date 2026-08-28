import { ChatContentItems, ChatToolMessage } from "@openrouter/sdk/models";
import { ToolDefinition } from "./tools";
import { read_knowledge } from "../knowledgebases/okf";


export const read_okf_tool: ToolDefinition = {
  name: "read_knowledge_base_document",
  schema: {
    type: "function",
    function: {
      name: "read_knowledge_base_document",
      description: "read a document from the knowledge base",
      parameters: {
        type: "object",
        properties: {
          knowledge_base: { type: "string", description: "Name of the knowledge base to read from" },
          document_name: { type: "string", description: "Name of the document to read" },
        },
        required: ["knowledge_base","document_name"],
      },
    },
  },
  callback: (knowledge_base: string, document_name: string ) : string | ChatContentItems[] => {
      return JSON.stringify( read_knowledge(knowledge_base, document_name));
      
  }
}
