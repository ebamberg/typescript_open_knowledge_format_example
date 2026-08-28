

 import { management_agent } from './agents';

 

function main() {
    console.info("Knowledge database processing");
  //  const answer=management_agent("what is the capital of Germany");
    const answer=management_agent("what is the capital of Germany and what are the capitols of the neighbor countries ");
    console.log(answer);

}

main()