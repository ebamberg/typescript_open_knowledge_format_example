 import { readFileSync} from 'fs';

import {SimpleMessage} from './model';
import { call_llm } from './openrouter';
import {read_okf_tool} from './tools/okf_tools'

import { listKnowledgeBases, read_knowledge } from './knowledgebases/okf';


const systemPrompt = readFileSync('src/prompts/system_prompt.md', 'utf8');
// const userprompt =  readFileSync('src/prompts/user_prompt.md', 'utf8');

const knowledgeBases = listKnowledgeBases();

export const management_agent = async (message: string) : Promise <SimpleMessage> => {
    const tools=[
        read_okf_tool
    ]
    const enrichtedSystemPrompt = systemPrompt.replace("{knowledge_bases}",JSON.stringify(knowledgeBases));
    return call_llm<SimpleMessage>(enrichtedSystemPrompt, message, "SimpleMessage", tools);

}