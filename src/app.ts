

import { management_agent } from './agents';
import { initOpenTelemetry, withTrace } from './observability/otel';
import { log } from './logger';


async function main() {

  initOpenTelemetry("knowledgebasereader","0.0.1");
  log.info("App", "starting knowledge base agent...");
  const agent= withTrace("management_agent", management_agent);

  const answer = await agent("I want to lease a floor in one of your buildings, what are the available options and what are the prices?");
  log.success("App", "answer:");
  log.json(answer);
}

main()