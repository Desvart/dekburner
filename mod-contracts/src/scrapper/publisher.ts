import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { IContractDTO } from "/mod-contracts/src/scrapper/IContractDTO";

export class Publisher {
  constructor(
    private readonly nsA: NsAdapter,
    private readonly contractPort: number,
  ) {}

  async publish(contracts: IContractDTO[], batchSize: number): Promise<void> {
    console.debug('Publishing contracts...');
    const batches: IContractDTO[][] = this.buildBatches(contracts, batchSize);

    let batchId: number = 0;
    for (const batch of batches) {
      console.debug('Publishing batch:', batchId, 'of', batches.length);
      await this.publishBatch(batch);
      batchId++;
    }
  }

  private buildBatches(contracts: IContractDTO[], batchSize: number): IContractDTO[][] {

    let batches: IContractDTO[][] = [];
    let batch: IContractDTO[] = [];

    let batchQuantity: number = Math.ceil(contracts.length / batchSize);
    console.debug('Total batches to publish:', batchQuantity);

    for (let i: number = 0; i < batchQuantity; i++) {
      batch = contracts.splice(0, batchSize);
      batches.push(batch);
    }

    return batches;
  }

  private async publishBatch(batch: IContractDTO[]): Promise<void> {

    const payload: string = JSON.stringify(batch);
    console.debug('Publishing batch:', payload);

    let publicationSuccessful:boolean = false;
    do {
      publicationSuccessful = this.nsA.publish(payload, this.contractPort);
      console.debug('Publication status:', publicationSuccessful ? 'success' : 'failed');
      await this.nsA.wait(5 * 1000); // 5 seconds

    } while (!publicationSuccessful)
  }



}
