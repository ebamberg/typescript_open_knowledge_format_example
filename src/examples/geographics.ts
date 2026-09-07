

import { management_agent } from '../agents';
import { initOpenTelemetry, withTrace } from '../observability/otel';
import { log } from '../logger';


async function main() {

  initOpenTelemetry("knowledgebasereader","0.0.1");
  log.info("App", "starting knowledge base agent (geographics)...");
  process.env["KNOWLEDGE_DATABASES"] = "./data/knowledge_bases/geographics";

  const agent= withTrace("management_agent", management_agent);
  const answer = await agent("what is the capital of Germany and what are the capitols of the neighbor countries ");
  log.success("App", "answer:");
  log.json(answer);
}

main()