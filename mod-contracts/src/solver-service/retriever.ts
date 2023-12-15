import { Config } from "/mod-contracts/src/common/config";
import { NsAdapter } from "/mod-contracts/src/solver-service/ns-adapter";
import { IContractDTO } from "/mod-contracts/src/common/IContractDTO";

export class Retriever {
    constructor(private readonly nsA: NsAdapter) {}

    isQueueEmpty(): boolean {
        return this.nsA.isQueueEmpty(Config.CONTRACT_PUBLICATION_PORT);
    }

    getPublishedContracts(): IContractDTO[] {
        const contractBatchRaw: string = this.nsA.readQueue(Config.CONTRACT_PUBLICATION_PORT);
        const contractBatch: IContractDTO[] = JSON.parse(contractBatchRaw);
        return contractBatch;
    }
}