import { ISolvedContractDTO } from "/mod-contracts/src/common/IContractDTO";
import { NsAdapter } from "/mod-contracts/src/submitter-service/ns-adapter";

export class Submitter {

    constructor(private readonly nsA: NsAdapter) {}

    async publish(solvedContracts: ISolvedContractDTO[]) {

      solvedContracts.forEach((contract: ISolvedContractDTO) => {

        const reward: string = this.nsA.attemptSolution(contract.solution as any[], contract.fileName, contract.hostname);

        if (!reward) {
          throw new Error(`Failed to submit solution for ${contract.fileName} on ${contract.hostname}.\n 
          Contract type: ${contract.type}\n
          Data: ${contract.data}\n
          Solution attempted: ${contract.solution}`);
        }

        const log: string = `Contract ${contract.type} on ${contract.hostname} solved with success. Reward: ${reward}`;
        this.nsA.print(log);
        console.log(log);
      });
    }
}