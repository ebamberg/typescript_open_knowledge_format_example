

import { management_agent } from './agents';
import { initOpenTelemetry, root_tracer } from './observability/otel';


function main() {
  initOpenTelemetry("knowledgebasereader","0.0.1");
  console.info("Knowledge database processing");
  //  const answer=management_agent("what is the capital of Germany");
  root_tracer.startActiveSpan('query capitals', (span) => {
    try {
      const answer=management_agent("what is the capital of Germany and what are the capitols of the neighbor countries ");
      console.log(answer);
    } catch (error: any) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message });
    } finally {
      span.end();
    }
  });

}

main()