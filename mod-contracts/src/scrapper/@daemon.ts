import { NS as INs } from '@ns';
import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { NetworkScanner } from '/mod-contracts/src/scrapper/network-scanner';
import { Scrapper } from "/mod-contracts/src/scrapper/scrapper";
import { IContractDTO } from "/mod-contracts/src/common/IContractDTO";
import { Publisher } from "/mod-contracts/src/scrapper/publisher";
import { Config, Constants } from "/mod-contracts/src/common/config";
import { Logger } from "/mod-common/src/logger";

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {

  const logger = new Logger(ns);
  logger.setupDebugMode(Config.DEBUG_MODE);

  const nsA = new NsAdapter(ns);
  nsA.cleanPreviousPublication(2);

  const orchestrator = new Orchestrator(nsA);
  await orchestrator.start();

  logger.resetDebugMode();
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
    console.debug(Constants.MODULE_NAME, 'Starting contract scrapper daemon...');

    do {
      const contracts: IContractDTO[] = this.scrapper.getAllContracts();
      // TODO: launch the solver service if contracts is not empty
      // the service should kill itself if the queue is empty
      await this.publisher.publish(contracts);
      await this.waitForNextLoop();
    } while (!this.exitConditionReached());

    console.debug(Constants.MODULE_NAME, 'Contract scrapper daemon stopped.');
  }

  private async waitForNextLoop(): Promise<void> {
    await this.nsA.wait(Config.WAIT_TIME_BETWEEN_SCRAPPING);
  }

  private exitConditionReached(): boolean {
    return false;
  }
}