import { CodingContractData, NS as INs } from "@ns";
import { Constants } from "/mod-contracts/src/common/config";

export class NsAdapter {

    constructor(private readonly ns: INs) {}

    scanForNeighbourServers(serverName: string): string[] {
        return this.ns.scan(serverName);
    }

  async wait(loopInterval: number): Promise<void> {
    await this.ns.sleep(loopInterval);
  }

  getContractType(fileName: string, hostname: string): string {
    return this.ns.codingcontract.getContractType(fileName, hostname);
  }

  getContractData(fileName: string, hostname: string): CodingContractData {
    return this.ns.codingcontract.getData(fileName, hostname);
  }

  getContractNames(hostname: string): string[] {
    return this.ns.ls(hostname, Constants.CONTRACT_FILE_EXTENSION);
  }

  cleanPreviousPublication(contractPort: number): void {
    this.ns.clearPort(contractPort);
  }

  publish(payload: string, contractPort: number): boolean {
    return this.ns.tryWritePort(contractPort, payload);
  }

}