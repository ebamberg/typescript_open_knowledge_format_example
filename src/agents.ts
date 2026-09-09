 import { readFileSync} from 'fs';

import {SimpleMessage} from './model';
import { call_llm } from './openrouter';
import {read_okf_tool} from './tools/okf_tools'

import { listKnowledgeBases, read_knowledge, KnowledgeBase } from './knowledgebases/okf';
import { withTrace } from './observability/otel';

const systemPrompt = readFileSync('src/prompts/knowledgebase_reader/system_prompt_v2.md', 'utf8');
// const userprompt =  readFileSync('src/prompts/user_prompt.md', 'utf8');

let knowledgeBases: KnowledgeBase[] | undefined;

const getKnowledgeBases = (): KnowledgeBase[] => {
    if (knowledgeBases === undefined) {
        knowledgeBases = listKnowledgeBases();
    }
    return knowledgeBases;
}

const llm_execute=withTrace("call llm",call_llm<SimpleMessage>);

export const management_agent = async (message: string) : Promise <SimpleMessage> => {
    const tools=[
        read_okf_tool
    ]
    const enrichtedSystemPrompt = systemPrompt.replace("{knowledge_bases}",JSON.stringify(getKnowledgeBases()));
    
    return llm_execute(enrichtedSystemPrompt, message, "SimpleMessage", tools);

}