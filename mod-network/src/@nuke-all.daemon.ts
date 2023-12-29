import { NS as INs } from '@ns';

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  const hackableServers: Server[] = new NetworkScanner(ns).filterHackableServers();
  hackableServers.forEach((hackableServer: Server) => {
    new BackdoorInstaller(ns).takeControl(hackableServer.name);
  });
}

class NetworkScanner {
  private readonly ns: INs;
  private network: Server[];

  constructor(ns: INs) {
    this.ns = ns;
    this.network = this.scan();
  }

  scan(): Server[] {
    const serversName: string[] = this.getServersName();
    return serversName.map((serverName) => new Server(this.ns, serverName));
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

  private keepOnlyUnscannedServers(serversName: string[], scannedServer: Set<string>): string[] {
    return serversName.filter((serverName) => !scannedServer.has(serverName));
  }

  private transformSetIntoArray(scannedServer: Set<string>): string[] {
    return Array.from(scannedServer.keys());
  }

  filterSecuredServers(): Server[] {
    return this.network.filter((server: Server) => !server.rootAccess);
  }

  filterHackableServers(): Server[] {
    const securedServers: Server[] = this.filterSecuredServers();
    return securedServers.filter(
      (server: Server) =>
        server.hackingLevel <= this.ns.getHackingLevel() &&
        server.portsQuantity <= this.getOpenPortToolsCount()
    );
  }

  getOpenPortToolsCount(): number {
    const OPEN_PORT_TOOLS: string[] = [
      'BruteSSH.exe',
      'FTPCrack.exe',
      'relaySMTP.exe',
      'HTTPWorm.exe',
      'SQLInject.exe',
    ];
    const allFilesOnHomeRoot: string[] = this.ns.ls('home');
    const ownedOpenPortTools: string[] = allFilesOnHomeRoot.filter((file) =>
      OPEN_PORT_TOOLS.includes(file)
    );
    return ownedOpenPortTools.length;
  }
}

class Server {
  private readonly ns: INs;
  public readonly name: string;
  public rootAccess: boolean;
  public hackingLevel: number;
  public portsQuantity: number;

  constructor(ns: INs, name: string) {
    this.ns = ns;
    this.name = name;
    this.rootAccess = this.ns.hasRootAccess(name);
    this.hackingLevel = this.ns.getServerRequiredHackingLevel(name);
    this.portsQuantity = this.ns.getServerNumPortsRequired(name);
  }
}

class BackdoorInstaller {
  private readonly ns: INs;

  constructor(ns: INs) {
    this.ns = ns;
  }

  takeControl(targetName: string): void {
    this.getRootAccess(targetName);
    //this.installBackdoor(targetName);
  }

  getRootAccess(targetName: string): void {
    if(this.ns.ls('home', 'BruteSSH.exe'))
      this.ns.brutessh(targetName);
    if(this.ns.ls('home', 'FTPCracker.exe'))
      this.ns.ftpcrack(targetName);
    if(this.ns.ls('home', 'HTTPWorm.exe'))
      this.ns.httpworm(targetName);
    if(this.ns.ls('home', 'SQLInject.exe'))
      this.ns.sqlinject(targetName);
    if(this.ns.ls('home', 'relaySMTP.exe'))
      this.ns.relaysmtp(targetName);

    this.ns.nuke(targetName);
  }

  installBackdoor(targetName: string): void {
    const doc = eval('document');
    const terminalInput = doc.getElementById('terminal-input');
    terminalInput.value=`home; goto ${targetName}`;
    const handler1 = Object.keys(terminalInput)[1];
    terminalInput[handler1].onChange({target:terminalInput});
    terminalInput[handler1].onKeyDown({key:'Enter',preventDefault:()=>null});
    terminalInput.value=`backdoor;`;
    const handler2 = Object.keys(terminalInput)[1];
    terminalInput[handler2].onChange({target:terminalInput});
    terminalInput[handler2].onKeyDown({key:'Enter',preventDefault:()=>null});
  }
}
