import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { IContractDTO } from "/mod-contracts/src/scrapper/IContractDTO";
import { Config } from "/mod-contracts/src/common/config";
import { debug } from "/mod-contracts/src/common/logger";

export class Publisher {
  constructor(
    private readonly nsA: NsAdapter,
  ) {}

  async publish(contracts: IContractDTO[]): Promise<void> {
    debug('Publishing contracts...');
    const batches: IContractDTO[][] = this.buildBatches(contracts);

    let batchId: number = 0;
    for (const batch of batches) {
      debug('Publishing batch:', batchId, 'of', batches.length);
      await this.publishBatch(batch);
      batchId++;
    }
  }

  private buildBatches(contracts: IContractDTO[]): IContractDTO[][] {

    let batches: IContractDTO[][] = [];
    let batch: IContractDTO[] = [];

    let batchQuantity: number = Math.ceil(contracts.length / Config.PUBLICATION_BATCH_SIZE);
    debug('Total batches to publish:', batchQuantity);

    for (let i: number = 0; i < batchQuantity; i++) {
      batch = contracts.splice(0, Config.PUBLICATION_BATCH_SIZE);
      batches.push(batch);
    }

    return batches;
  }

  private async publishBatch(batch: IContractDTO[]): Promise<void> {

    const payload: string = JSON.stringify(batch);
    debug('Publishing batch:', payload);

    let publicationSuccessful:boolean = false;
    do {
      publicationSuccessful = this.nsA.publish(payload, Config.CONTRACT_PUBLICATION_PORT);
      debug('Publication status:', publicationSuccessful ? 'success' : 'failed');
      await this.nsA.wait(Config.WAIT_TIME_TO_NEXT_PUBLICATION);

    } while (!publicationSuccessful)
  }



}
