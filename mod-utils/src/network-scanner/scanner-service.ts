import { NS as INs } from '@ns';

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  const nsAdapter = new NsAdapter(ns);
  const scanner = new Scanner(nsAdapter);
  scanner.cleanPublishingPort();
  await scanner.periodicPublishOfNetworkStaticData();
}

class Scanner {
  private readonly SCANNER_PORT = 1;
  private readonly PUBLISHING_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly nsA: NsAdapter) {}

  cleanPublishingPort(): void {
    console.debug('Cleaning publishing port');
    this.nsA.cleanupPort(this.SCANNER_PORT);
  }

  async periodicPublishOfNetworkStaticData(): Promise<void> {
    let networkStaticData: ServerStaticData[] = [];
    do {
      networkStaticData = this.getLatestNetworkStaticData();
      this.publishData(networkStaticData);
      await this.nsA.sleep(this.PUBLISHING_INTERVAL);
    } while (this.scanCompletion(networkStaticData.length) < 100);
  }

  private getLatestNetworkStaticData(): ServerStaticData[] {
    const serversName: string[] = this.getServersName();
    return this.enrichServersWithStaticData(serversName);
  }

  private getServersName(currentNode = 'home', scannedServer: Set<string> = new Set()): string[] {
    const neighbourServers: string[] = this.nsA.scanForNeighbourServers(currentNode);
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

  private enrichServersWithStaticData(serversName: string[]): ServerStaticData[] {
    let networkStaticData: ServerStaticData[] = [];
    serversName.forEach((serverName) => {
      networkStaticData.push(new ServerBuilder(this.nsA, serverName).build());
    });
    return networkStaticData;
  }

  private scanCompletion(scannedCount: number): number {
    const EXTERNAL_SERVERS_COUNT = 72;
    return (scannedCount / (EXTERNAL_SERVERS_COUNT + this.nsA.getMaxOwnedServerCount())) * 100;
  }

  private publishData(networkStaticData: ServerStaticData[]): void {
    const jsonData: string = JSON.stringify(networkStaticData);
    this.cleanPublishingPort();
    this.nsA.writeToPort(this.SCANNER_PORT, jsonData);
  }
}

class ServerBuilder {
  constructor(
    private readonly nsA: NsAdapter,
    private readonly name: string
  ) {}

  build(): ServerStaticData {
    const serverData = this.nsA.getServerData(this.name);
    return new ServerStaticData(
      this.name,
      serverData.hackingSkillThreshold,
      serverData.portsQuantity,
      serverData.maxRam,
      serverData.minSecurity,
      serverData.maxMoney,
      serverData.growthFactor,
      serverData.owner,
      this.name === 'home'
    );
  }
}

export interface IServerStaticData {
  name: string;
  level: number;
  portsQuantity: number;
  maxRam: number;
  minSecurity: number;
  maxMoney: number;
  growthFactor: number;
  owner: string;
  isHome: boolean;
}

class ServerStaticData implements IServerStaticData {
  constructor(
    public readonly name: string,
    public readonly level: number,
    public readonly portsQuantity: number,
    public readonly maxRam: number,
    public readonly minSecurity: number,
    public readonly maxMoney: number,
    public readonly growthFactor: number,
    public readonly owner: string,
    public readonly isHome: boolean
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

  scanForNeighbourServers(serverName: string): string[] {
    return this.ns.scan(serverName);
  }

  getMaxOwnedServerCount(): number {
    return this.ns.getPurchasedServerLimit();
  }

  writeToPort(portId: number, jsonData: string):void {
    this.ns.tryWritePort(portId, jsonData);
  }

  getServerData(serverName: string) {
    const data = this.ns.getServer(serverName);
    return {
      hackingSkillThreshold: data.requiredHackingSkill as number,
      portsQuantity: data.numOpenPortsRequired as number,
      maxRam: data.maxRam as number,
      minSecurity: data.minDifficulty as number,
      maxMoney: data.moneyMax as number,
      growthFactor: data.serverGrowth as number,
      owner: data.organizationName
    };
  }
}
