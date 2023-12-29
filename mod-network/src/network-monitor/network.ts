import { Server } from "/mod-network/src/network-monitor/server";
import { NS as INs } from "@ns";

export class Network {
  public readonly servers: Server[];

  constructor(private readonly ns: INs) {
    this.servers = this.getServers();
  }

  getServers(): Server[] {
    const serverNames: string[] = this.getServersName();
    return serverNames.map(serverName => new Server(this.ns, serverName));
  }

  private getServersName(currentNode = 'home', scannedServer: Set<string> = new Set()): string[] {
    const neighbourServers: string[] = this.ns.scan(currentNode);
    const serversToScan: string[] = this.keepOnlyUnscannedServers(neighbourServers, scannedServer);
    serversToScan.forEach((serverName) => {
      scannedServer.add(serverName);
      this.getServersName(serverName, scannedServer);
    });
    return this.transformSetIntoArray(scannedServer);
  }

  keepOnlyUnscannedServers(serversName: string[], scannedServer: Set<string>): string[] {
    return serversName.filter((serverName) => !scannedServer.has(serverName));
  }

  private transformSetIntoArray(scannedServer: Set<string>): string[] {
    return Array.from(scannedServer.keys());
  }
}