import { NS as INs } from '@ns';
import { Logger } from "/mod-common/src/logger";
import { Config, Constants } from "/mod-contracts/src/common/config";
import { NsAdapter } from "/mod-contracts/src/solver-service/ns-adapter";
import { IContractDTO, ISolvedContractDTO } from "/mod-contracts/src/common/IContractDTO";
import { Retriever } from "/mod-contracts/src/solver-service/retriever";
import { BatchSolver } from "/mod-contracts/src/solver-service/batch-solver";
import { Publisher } from "/mod-contracts/src/solver-service/publisher";

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
  private batchSolver: BatchSolver;
  private publisher: Publisher;

  constructor(readonly nsA: NsAdapter) {
    this.retriever = new Retriever(nsA);
    this.batchSolver = new BatchSolver();
    this.publisher = new Publisher(nsA);
  }

  async start(): Promise<void> {
    console.debug(Constants.SOLVER_SUBMODULE_NAME, 'Starting contract solver service...');

    while (true) {
      if (!this.retriever.isQueueEmpty()) {
        const contracts: IContractDTO[] = this.retriever.getPublishedContracts();
        const solvedContracts: ISolvedContractDTO[] = this.batchSolver.solve(contracts);
        await this.publisher.publish(solvedContracts);
      } else {
        await this.nsA.waitForPortData(Config.CONTRACT_PUBLICATION_PORT);
      }

      console.debug(Constants.SOLVER_SUBMODULE_NAME, 'Contract solver service stopped.');
    }
  }
}