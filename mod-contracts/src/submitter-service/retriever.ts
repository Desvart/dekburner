import { Config, Constants } from "/mod-contracts/src/common/config";
import { NsAdapter } from "/mod-contracts/src/submitter-service/ns-adapter";
import { ISolvedContractDTO } from "/mod-contracts/src/common/IContractDTO";

export class Retriever {
    constructor(private readonly nsA: NsAdapter) {}

    isQueueEmpty(): boolean {
        const queueStatus: boolean = this.nsA.isQueueEmpty(Config.SOLUTION_PUBLICATION_PORT);
        console.debug(Constants.SUBMITTER_SUBMODULE_NAME, `Queue status: ${queueStatus}`);
        return queueStatus;
    }

    getSolvedContracts(): ISolvedContractDTO[] {
        console.debug(Constants.SUBMITTER_SUBMODULE_NAME, 'Retrieving batch of solved contracts...');
        const solvedContractBatchRaw: string = this.nsA.readQueue(Config.SOLUTION_PUBLICATION_PORT);
        const solvedContractBatch: ISolvedContractDTO[] = JSON.parse(solvedContractBatchRaw);
        console.debug(Constants.SUBMITTER_SUBMODULE_NAME, `Retrieved batch of ${solvedContractBatch.length} solved contracts:`, solvedContractBatch);
        return solvedContractBatch;
    }
}