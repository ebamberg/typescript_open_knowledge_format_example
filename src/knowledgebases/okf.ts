 import {readdirSync, statSync, readFileSync} from 'fs';
 import matter from 'gray-matter';
 import {join} from 'path';


const KNOWLEDGE_DATABASES = process.env.KNOWLEDGE_DATABASES ?? "data/knowledge_bases";

export interface KnowledgeBase {
    name: string,
    path: string,
    metadata: { [key: string]: any; },
    content: {},
}

export function listKnowledgeBases(): KnowledgeBase[] {
    const knowledgeBases: KnowledgeBase[] = [];
    const items = readdirSync(KNOWLEDGE_DATABASES);

    for (const item of items) {
        const fullPath = join(KNOWLEDGE_DATABASES, item);
        if (statSync(fullPath).isDirectory()) {
            // Read the Markdown file
            const knowledgefile = join(fullPath,"index.md")
            const fileContent = readFileSync(knowledgefile, 'utf-8');

            // Parse the file content
            const { data, content } = matter(fileContent);
            knowledgeBases.push( { name: item, path:fullPath, metadata: data, content: content });
        }
    }

    return knowledgeBases;
}

export function read_knowledge( {knowledge_base, document_name} : { knowledge_base: string, document_name: string } ) : KnowledgeBase {

    if (!document_name.endsWith(".md")) {
        document_name=document_name+".md";
    }
    // Read the Markdown file
    const knowledgefile = join(KNOWLEDGE_DATABASES,knowledge_base,document_name)
    const fileContent = readFileSync(knowledgefile, 'utf-8');

    // Parse the file content
    const { data, content } = matter(fileContent);

    console.log('YAML Metadata:', data);
    console.log('Markdown Content:', content);
    return { name: document_name, path:knowledgefile , metadata: data, content: content };

}
