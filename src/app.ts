

import { management_agent } from './agents';
import { initOpenTelemetry, withTrace } from './observability/otel';
import { log } from './logger';


async function main() {

  initOpenTelemetry("knowledgebasereader","0.0.1");
  log.info("App", "starting knowledge base agent...");
  process.env["KNOWLEDGE_DATABASES"] = "./data/knowledge_bases/facility_management";

  const agent= withTrace("management_agent", management_agent);

  const answer = await agent("which office rooms are nearest to a conference room on the 3rd floor?");
  log.success("App", "answer:");
}

main()