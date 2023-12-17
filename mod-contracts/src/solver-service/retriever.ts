import { Config, Constants } from "/mod-contracts/src/common/config";
import { NsAdapter } from "/mod-contracts/src/solver-service/ns-adapter";
import { IContractDTO } from "/mod-contracts/src/common/IContractDTO";

export class Retriever {
    constructor(private readonly nsA: NsAdapter) {}

    isQueueEmpty(): boolean {
        const queueStatus: boolean = this.nsA.isQueueEmpty(Config.CONTRACT_PUBLICATION_PORT);
        console.debug(Constants.SOLVER_SUBMODULE_NAME, `Queue status: ${queueStatus}`);
        return queueStatus;
    }

    getPublishedContracts(): IContractDTO[] {
        console.debug(Constants.SOLVER_SUBMODULE_NAME, 'Retrieving batch of published contracts...');
        const contractBatchRaw: string = this.nsA.readQueue(Config.CONTRACT_PUBLICATION_PORT);
        const contractBatch: IContractDTO[] = JSON.parse(contractBatchRaw);
        console.debug(Constants.SOLVER_SUBMODULE_NAME, `Retrieved batch of ${contractBatch.length} contracts:`, contractBatch);
        return contractBatch;
    }
}