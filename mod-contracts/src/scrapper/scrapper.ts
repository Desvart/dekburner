import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { Contract } from "/mod-contracts/src/scrapper/contract";
import { IContractDTO } from "/mod-contracts/src/scrapper/IContractDTO";
import { debug } from "/mod-contracts/src/common/logger";

export class Scrapper {
  constructor(
    private readonly nsA: NsAdapter,
    private readonly serverNames: string[]
  ) {}

  getAllContracts(): IContractDTO[] {
    debug('Scanning for contracts...');

    let allContracts: Contract[] = [];

    this.serverNames.forEach((serverName: string): void => {
      const serverContracts: Contract[] = this.getServerContracts(serverName);
      allContracts.push(...serverContracts);
    });

    debug('Total contracts found:', allContracts.length);

    return this.convertToDTO(allContracts);
  }

  private getServerContracts(hostname: string): Contract[] {
    debug('Scanning for contracts on', hostname);
    const contractNames: string[] = this.nsA.getContractNames(hostname);
    const contracts: Contract[] = contractNames.map((contractName: string): Contract =>
      new Contract(this.nsA, contractName, hostname)
    );
    debug('Contracts found on', hostname, ':', contracts.length);
    return contracts;
  }

  private convertToDTO(contracts: Contract[]): IContractDTO[] {
    return contracts.map((contract: Contract): IContractDTO => contract.toDTO());
  }
}
