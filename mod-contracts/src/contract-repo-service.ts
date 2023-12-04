import { NS as INs } from '@ns';
import { IServerStaticDataDTO } from '@res/IServerStaticDataDTO';

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  const nsAdapter: NsAdapter = new NsAdapter(ns);
  const scanner: Scanner = new Scanner(nsAdapter);
  scanner.cleanPublishingPort();
  await scanner.periodicPublishOfAvailableContracts();
}

class Scanner {
  private readonly SCANNER_PORT = 1;
  private readonly CONTRACT_PORT = 2;
  private readonly PUBLISHING_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly nsA: NsAdapter) {}

  cleanPublishingPort(): void {
    this.nsA.cleanupPort(this.CONTRACT_PORT);
  }

  async periodicPublishOfAvailableContracts(): Promise<void> {
    let exitConditionReached = false;
    do {
      const contracts: Contract[] = this.getAllAvailableContrats();
      console.log(contracts);
      this.publishData(contracts);
      await this.nsA.sleep(this.PUBLISHING_INTERVAL);
    } while (!exitConditionReached);
  }

  private getAllAvailableContrats(): Contract[] {
    const hostnames: string[] = this.getAllServerNames();
    return this.getAllContracts(hostnames);
  }

  private getAllServerNames(): string[] {
    const rawNetwork: string = this.nsA.peek(this.SCANNER_PORT) as string;
    console.log(rawNetwork);
    const serverStaticData: IServerStaticDataDTO[] = JSON.parse(rawNetwork);
    return serverStaticData.map((server: IServerStaticDataDTO) => server.name);
  }

  private getAllContracts(hostnames: string[]): Contract[] {
    let allContracts: Contract[] = [];
    hostnames.forEach((hostname: string) => {
      const hostContracts: Contract[] = this.getContracts(hostname);
      allContracts.concat(hostContracts);
    });
    return allContracts;
  }

  private getContracts(hostname: string): Contract[] {
    const contractFiles = this.nsA.ls(hostname, '.cct');
    let hostContracts: Contract[] = [];
    contractFiles.forEach((contractFile: string) => {
      const contractType: string = this.nsA.getContractType(hostname, contractFile);
      const contractData: string|string[]|number|number[] = this.nsA.getContractData(hostname, contractFile);
      const contract: Contract = new Contract(hostname, contractFile, contractType, contractData);
      hostContracts.push(contract);
    });
    return hostContracts;
  }

  private publishData(contracts: Contract[]): void {
    const jsonData: string = JSON.stringify(contracts);
    this.cleanPublishingPort();
    this.nsA.writeToPort(this.CONTRACT_PORT, jsonData);
  }

}

class Contract {
  constructor(
    public readonly host: string,
    public readonly name: string,
    public readonly type: string,
    public readonly data: string|string[]|number|number[]
  ) {}
}

class NsAdapter {
  constructor(private readonly ns: INs) {}

  cleanupPort(portId: number): void {
    this.ns.clearPort(portId);
  }

  async sleep(durationInMillisec: number): Promise<void> {
    await this.ns.sleep(durationInMillisec);
  }

  writeToPort(portId: number, jsonData: string): void {
    this.ns.tryWritePort(portId, jsonData);
  }

  peek(portId: number): string|string[]|number|number[] {
    return this.ns.peek(portId);
  }

  ls(hostname: string, extension: string): string[] {
    return this.ns.ls(hostname, extension);
  }

  getContractType(hostname: string, fileName: string): string {
    return this.ns.codingcontract.getContractType(fileName, hostname);
  }

  getContractData(hostname: string, fileName: string): string|string[]|number|number[] {
    return this.ns.codingcontract.getData(fileName, hostname);
  }
}
