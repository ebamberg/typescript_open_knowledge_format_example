


import { management_agent } from '../agents';
import { initOpenTelemetry, withTrace } from '../observability/otel';
import { log } from '../logger';


async function main() {

  initOpenTelemetry("knowledgebasereader","0.0.1");
  log.info("App", "starting knowledge base agent (facility management)...");
  process.env["KNOWLEDGE_DATABASES"] = "./data/knowledge_bases/facility_management";

  const agent= withTrace("management_agent", management_agent);
  const answer = await agent("I want to lease a floor in one of your buildings, what are the available options and what are the prices?");
  log.success("App", "answer to the question 'I want to lease a floor in one of your buildings, what are the available options and what are the prices?':");
  

  const answer2 = await agent("which office rooms are nearest to a conference room on the 3rd floor?");
  log.success("App", "answer to the question 'which office rooms are nearest to a conference room on the 3rd floor?':");

}

main()