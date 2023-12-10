import { NS as INs } from '@ns';
import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { NetworkScanner } from '/mod-contracts/src/scrapper/network-scanner';
import { Scrapper } from "/mod-contracts/src/scrapper/scrapper";
import { IContractDTO } from "/mod-contracts/src/scrapper/IContractDTO";
import { Publisher } from "/mod-contracts/src/scrapper/publisher";

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {

  const nsA: NsAdapter = new NsAdapter(ns);
  nsA.cleanPreviousPublication(2);

  const orchestrator = new Orchestrator(nsA);
  await orchestrator.start();

}

class Orchestrator {

  private readonly CONTRACT_PORT: number = 2;
  private readonly LOOP_INTERVAL: number = 5 * 60 * 1000; // 5 minutes
  private readonly BATCH_SIZE: number = 5;

  private scrapper: Scrapper;
  private publisher: Publisher;

  constructor(private readonly nsA: NsAdapter) {
    const serverNames: string[] = new NetworkScanner(this.nsA).getServerNames();
    this.scrapper = new Scrapper(this.nsA, serverNames);
    this.publisher = new Publisher(this.nsA, this.CONTRACT_PORT);
  }

  async start(): Promise<void> {
    console.debug('Starting contract scrapper daemon...');

    do {
      const contracts: IContractDTO[] = this.scrapper.getAllContracts();
      await this.publisher.publish(contracts, this.BATCH_SIZE);
      await this.waitForNextLoop(this.LOOP_INTERVAL);
    } while (!this.exitConditionReached());

    console.debug('Contract scrapper daemon stopped.');
  }

  private async waitForNextLoop(loopInterval: number): Promise<void> {
    await this.nsA.wait(loopInterval);
  }

  private exitConditionReached(): boolean {
    return false;
  }
}