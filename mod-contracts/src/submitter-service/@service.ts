import { NS as INs } from '@ns';
import { Logger } from "/mod-common/src/logger";
import { Config, Constants } from "/mod-contracts/src/common/config";
import { NsAdapter } from "/mod-contracts/src/submitter-service/ns-adapter";
import { ISolvedContractDTO } from "/mod-contracts/src/common/IContractDTO";
import { Retriever } from "/mod-contracts/src/submitter-service/retriever";
import { Submitter } from "/mod-contracts/src/submitter-service/submitter";

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {

  const logger = new Logger(ns);
  logger.setupDebugMode(Config.DEBUG_MODE);

  const nsA = new NsAdapter(ns);

  const orchestrator = new Orchestrator(nsA);
  await orchestrator.start();

  logger.resetDebugMode();
}

class Orchestrator {

  private retriever: Retriever;
  private submitter: Submitter;

  constructor(readonly nsA: NsAdapter) {
    this.retriever = new Retriever(nsA);
    this.submitter = new Submitter(nsA);
  }

  async start(): Promise<void> {
    console.debug(Constants.SUBMITTER_SUBMODULE_NAME, 'Starting contract solution submitter service...');

    while (true) {
      if (!this.retriever.isQueueEmpty()) {
      const solvedContracts: ISolvedContractDTO[] = this.retriever.getSolvedContracts();
      await this.submitter.publish(solvedContracts);
      } else {
        await this.nsA.waitForPortData(Config.SOLUTION_PUBLICATION_PORT);
      }
    }

    console.debug(Constants.SUBMITTER_SUBMODULE_NAME, 'Contract solution submitter service stopped.');
  }
}