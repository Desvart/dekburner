import { NS as INs } from '@ns';
import { IServerStaticData } from '/network-scanner/scanner-service';

// TODO: Remove scan-network-daemon.ts and use this script instead
// TODO: Add a way to automatically launch scanner-service.ts if it is not already running
// TODO: Split the monitoring-app.ts into multiple short scripts
// TODO: Split the scanner-service.ts into multiple short scripts and put all that into a dedicated subfolder

/** @param {NS} ns */
export async function main(ns: INs) {
  ns.tail();
  ns.disableLog('ALL');
  ns.clearLog();

  const refreshRate: number = (ns.args[0] as number) || 1000;
  const display = new Display(ns, refreshRate);
  await display.build();
  await display.show(new Network(ns));
}

class Display {
  private doc: any;
  private readonly anchor: string;
  readonly anchorId: string = 'scanAnchor';
  private tag: HTMLElement;

  constructor(
    private readonly ns: INs,
    private readonly refreshRate: number
  ) {
    this.doc = eval('document');
    this.anchor = `Refreshing every ${this.refreshRate / 1000} seconds...`;
    this.tag = this.doc.createElement('p');
  }

  async injectAnchorInLogWindow(): Promise<void> {
    this.ns.print(this.anchor);
    await this.ns.sleep(200);
  }

  injectEmptyContainerBeforeAnchor(): void {
    const container: string = `<p class="MuiTypography-root MuiTypography-body1 css-cxl1tz" id="${this.anchorId}"></p>`;
    const xpath: string = `//span[contains(text(), "${this.anchor}")]`;
    const matchingElement: HTMLElement = <HTMLElement>(
      this.doc.evaluate(xpath, this.doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue
    );
    matchingElement.insertAdjacentHTML('beforebegin', container);
    this.tag = this.doc.querySelector('#' + this.anchorId);
  }

  async build(): Promise<void> {
    await this.injectAnchorInLogWindow();
    this.injectEmptyContainerBeforeAnchor();
  }

  updateDisplay(content: string): void {
    this.tag.innerHTML = content;
  }

  async show(network: Network): Promise<void> {
    let exitCondition: boolean = false;
    do {
      this.updateDisplay(network.buildHTMLContent());
      await this.ns.sleep(this.refreshRate);
    } while (!exitCondition);
  }
}

class Network {
  private servers: IServerStaticData[];
  private readonly SCANNER_PORT = 1;

  constructor(private readonly ns: INs) {
    this.servers = this.getServers();
  }

  getServers(): IServerStaticData[] {
    const rawNetwork = this.ns.peek(this.SCANNER_PORT) as string;
    return JSON.parse(rawNetwork).map((server: IServerStaticData) => server);
  }

  buildHTMLContent(): string {
    this.sortNetworkForDisplayPurpose();
    return `<div style='font-size: 10px'>` + this.buildServersContent() + '</div>';
  }

  private sortNetworkForDisplayPurpose(): void {
    // network.sort((a, b) => (b.isHome ? 1 : 0) - (a.isHome ? 1 : 0)); //sort by parent-child relationships
    this.servers.sort(
      (a, b) =>
        (b.isHome ? 1 : 0) - (a.isHome ? 1 : 0) || a.level - b.level || b.maxMoney - a.maxMoney
    );
  }

  buildServersContent(): string {
    let output = `<div style='font-size: 10px'>`;
    this.servers.forEach((server: IServerStaticData) => {
      const hackColor: string = this.getHackColor(server);
      const nameColor: string = this.getFactionColor(server);
      const hoverText: string = this.buildHoverText(server);
      const contractText: string = this.getContracts(server);
      output += this.buildServerHTML(server, hackColor, nameColor, hoverText, contractText);
    });
    return output + '</div>';
  }

  private getHackColor(server: IServerStaticData): string {
    // Color of the square in front of the server name.
    let hackColor = 'red'; // Red = no admin rights and not nukable
    // hackColor = server.canBeNuked ? 'yellow' : hackColor; // Yellow = no admin rights but nukable
    // hackColor = server.isRoot ? 'cyan' : hackColor; // Blue = admin but not backdoor
    // hackColor = server.backdoor || server.isHome || server.purchased ? 'lime' : hackColor; // Green = admin and backdoor
    return hackColor;
  }

  private getFactionColor(server: IServerStaticData): string {
    // Color the server names based on the factions
    const facServers: { [key: string]: string } = {
      CSEC: 'yellow',
      'avmnite-02h': 'yellow',
      'I.I.I.I': 'yellow',
      run4theh111z: 'yellow',
      'The-Cave': 'orange',
      w0r1d_d43m0n: 'red',
    };
    return facServers[server.name] ? facServers[server.name] : 'white';
  }

  private buildHoverText(server: IServerStaticData): string {
    // Provide technical information about the server when hovering the mouse
    return [
      'Req Level: ',
      server.level,
      '&#10;Req Ports: ',
      server.portsQuantity,
      '&#10;Memory: ',
      server.maxRam,
      'GB',
      '&#10;Security: ',
      //server.security.level,
      '/',
      server.minSecurity,
      '&#10;Money: ',
      //ns.nFormat(server.money.available, '$0.000a'),
      ' (',
      //Math.round((server.money.available / server.money.max) * 100),
      '%)',
    ].join('');
  }

  getContracts(server: IServerStaticData): string {
    const contracts: string[] = this.ns.ls(server.name, '.cct');
    return `${contracts.length}©`;
  }

  private buildServerHTML(
    server: IServerStaticData,
    hackColor: string,
    nameColor: string,
    hoverText: string,
    contractText: string
  ): string {
    return [
      // `<span style="color: black">` + "--".repeat(server.depth) + `</span>`, // For display indentation
      `<span style="color: black">` + '--' + `</span>`, // For display indentation
      `<span style='color:${hackColor}'>■ </span>`,
      `<a class='scan-analyze-link' title='${hoverText}'
      onClick="(function() { // On click connect directly to the server. Requires connect.js script and goto alias to work
          const doc = eval('document');
          const terminalInput = doc.getElementById('terminal-input');
          terminalInput.value='home; goto ${server.name}';
          const handler = Object.keys(terminalInput)[1];
          terminalInput[handler].onChange({target:terminalInput});
          terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
      })();"
      style='color:${nameColor}'>${server.name}</a> `,
      `<span style='color:fuchsia'>${contractText}</span>`,
      '<br>',
    ].join('');
  }
}