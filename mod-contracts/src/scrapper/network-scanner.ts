import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { Constants } from "/mod-contracts/src/common/config";

export class NetworkScanner {

  constructor(private readonly nsA: NsAdapter) {}

  getServerNames(currentNode = Constants.HOME_HOSTNAME, scannedServer: Set<string> = new Set()): string[] {

    const neighbourServers: string[] = this.nsA.scanForNeighbourServers(currentNode);
    const serversToScan: string[] = this.filterAlreadyScannedServers(neighbourServers, scannedServer);

    serversToScan.forEach((serverName: string): void => {
      scannedServer.add(serverName);
      this.getServerNames(serverName, scannedServer);
    });

    return this.transformSetIntoArray(scannedServer);
  }

  private filterAlreadyScannedServers(serversName: string[], scannedServer: Set<string>): string[] {
    return serversName.filter((serverName: string) => !scannedServer.has(serverName));
  }

  private transformSetIntoArray(scannedServer: Set<string>): string[] {
    return Array.from(scannedServer.keys());
  }
}
