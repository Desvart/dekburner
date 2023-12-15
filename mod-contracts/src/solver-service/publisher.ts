import { ISolvedContractDTO } from "/mod-contracts/src/common/IContractDTO";
import { NsAdapter } from "/mod-contracts/src/solver-service/ns-adapter";
import { Config, Constants } from "/mod-contracts/src/common/config";

export class Publisher {
    constructor(private readonly nsA: NsAdapter) {}

    async publish(solvedContracts: ISolvedContractDTO[]): Promise<void> {

      const payload: string = JSON.stringify(solvedContracts);
      console.debug(Constants.MODULE_NAME, 'Publishing batch of solved contracts:', payload);

      let publicationSuccessful: boolean = this.publishAndLog(payload);

      while (!publicationSuccessful) {
        await this.nsA.wait(Config.WAIT_TIME_TO_NEXT_PUBLICATION);
        publicationSuccessful = this.publishAndLog(payload);
      }
    }

  private publishAndLog(payload: string): boolean {
    const publicationSuccessful: boolean = this.nsA.publish(payload, Config.SOLUTION_PUBLICATION_PORT);
    console.debug(Constants.MODULE_NAME, 'Publication status:', publicationSuccessful ? 'success' : 'failed');
    return publicationSuccessful;
  }
}