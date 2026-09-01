

import { management_agent } from './agents';
import { initOpenTelemetry, withTrace } from './observability/otel';


function main() {
  initOpenTelemetry("knowledgebasereader","0.0.1");
  console.info("Knowledge database processing");
  //  const answer=management_agent("what is the capital of Germany");
  const agent= withTrace("management_agent", management_agent);
  const answer=agent("what is the capital of Germany and what are the capitols of the neighbor countries ");
  console.log(answer);
}

main()