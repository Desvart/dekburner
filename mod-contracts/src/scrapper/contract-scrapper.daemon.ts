import { NS as INs } from '@ns';
import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { NetworkScanner } from '/mod-contracts/src/scrapper/network-scanner';
import { Scrapper } from "/mod-contracts/src/scrapper/scrapper";
import { IContractDTO } from "/mod-contracts/src/scrapper/IContractDTO";
import { Publisher } from "/mod-contracts/src/scrapper/publisher";
import { Config } from "/mod-contracts/src/common/config";
import { debug } from "/mod-contracts/src/common/logger";

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {

  const nsA: NsAdapter = new NsAdapter(ns);
  nsA.cleanPreviousPublication(2);

  const orchestrator = new Orchestrator(nsA);
  await orchestrator.start();

}

class Orchestrator {

  private scrapper: Scrapper;
  private publisher: Publisher;

  constructor(private readonly nsA: NsAdapter) {
    const serverNames: string[] = new NetworkScanner(this.nsA).getServerNames();
    this.scrapper = new Scrapper(this.nsA, serverNames);
    this.publisher = new Publisher(this.nsA);
  }

  async start(): Promise<void> {
    debug('Starting contract scrapper daemon...');

    do {
      const contracts: IContractDTO[] = this.scrapper.getAllContracts();
      await this.publisher.publish(contracts);
      await this.waitForNextLoop();
    } while (!this.exitConditionReached());

    debug('Contract scrapper daemon stopped.');
  }

  private async waitForNextLoop(): Promise<void> {
    await this.nsA.wait(Config.WAIT_TIME_BETWEEN_SCRAPPING);
  }

  private exitConditionReached(): boolean {
    return false;
  }
}