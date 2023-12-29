import { Network } from '/mod-network/src/network-monitor/network';
import { AdminStatus, Server } from '/mod-network/src/network-monitor/server';

export class ConverterNetworkToHtml {
  private servers: Server[];

  constructor(network: Network) {
    this.servers = network.getServers();
  }

  buildHTMLContent(): string {
    this.sortNetworkForDisplayPurpose();
    return `<div style='font-size: 10px'>` + this.buildServersContent() + '</div>';
  }

  private sortNetworkForDisplayPurpose(): void {
    // network.sort((a, b) => (b.isHome ? 1 : 0) - (a.isHome ? 1 : 0)); //sort by parent-child relationships
    this.servers.sort((a, b) => {
      const aIsHome = a.name === 'home' ? 1 : 0;
      const bIsHome = b.name === 'home' ? 1 : 0;
      return bIsHome - aIsHome || a.hackingLevel - b.hackingLevel || b.maxMoney - a.maxMoney;
    });
  }

  buildServersContent(): string {
    let output = `<div style='font-size: 10px'>`;
    this.servers.forEach((server: Server) => {
      const hackColor: string = this.getHackColor(server);
      const nameColor: string = this.getFactionColor(server);
      const hoverText: string = this.buildHoverText(server);
      let contractText: string = '';
      if (server.contractCount > 0) {
        contractText = `${server.contractCount} ©`;
      }
      output += this.buildServerHTML(server, hackColor, nameColor, hoverText, contractText);
    });
    return output + '</div>';
  }

  private getHackColor(server: Server): string {
    // Color of the square in front of the server name.
    let hackColor = 'red'; // Red = no admin rights and not nukable
    hackColor = server.adminStatus === AdminStatus.HACKABLE ? '#FFD700' : hackColor; // Yellow = no admin rights but nukable
    hackColor = server.adminStatus === AdminStatus.ROOT ? '#00BFFF' : hackColor; // Blue = admin but not backdoor
    hackColor = server.adminStatus === AdminStatus.BACKDOOR ? 'lime' : hackColor; // Green = admin and backdoor
    return hackColor;
  }

  private getFactionColor(server: Server): string {
    // Color the server names based on the factions
    const facServers: { [key: string]: string } = {
      'CSEC': 'yellow',
      'avmnite-02h': 'yellow',
      'I.I.I.I': 'yellow',
      'run4theh111z': 'yellow',
      'The-Cave': 'orange',
      'w0r1d_d43m0n': 'red',
    };
    return facServers[server.name] ? facServers[server.name] : 'white';
  }

  private buildHoverText(server: Server): string {
    // Provide technical information about the server when hovering the mouse
    const moneyRatio = Math.round((server.currentMoney / server.maxMoney) * 100);
    return [
      `Req Level: ${server.hackingLevel}&#10;`,
      `Req Ports: ${server.openPortCount} / ${server.totalPortCount}&#10;`,
      `Memory: ${server.maxRam} GB&#10;`,
      `Security: ${server.currentSecurty} / ${server.minSecurity}&#10;`,
      `Money: ${this.toEngineeringNotation(server.currentMoney)} / ${this.toEngineeringNotation(server.maxMoney)} (${moneyRatio}%)&#10;`,
      `Growth: ${server.growthFactor}&#10;`,
      `Hacking Chance: ${this.roundPercent(server.hackChance)} %&#10;`,
      `Hacking Time: ${this.formatMilliseconds(server.hackDuration)} &#10;`,
    ].join('');
  }

  private toEngineeringNotation(num: number): string {
    if (num === 0) return "0e+0";

    let exponent = Math.floor(Math.log10(Math.abs(num)));
    let normalizedExponent = Math.floor(exponent / 3) * 3;

    let mantissa = num / Math.pow(10, normalizedExponent);

    // Adjust mantissa to avoid floating-point issues
    mantissa = +mantissa.toFixed(3);

    return `${mantissa}e${normalizedExponent >= 0 ? '+' : ''}${normalizedExponent}`;
  }

  private formatMilliseconds(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600000); // 1 hour = 3600000 milliseconds
    const minutes = Math.floor((milliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds
    const seconds = Math.floor((milliseconds % 60000) / 1000); // 1 second = 1000 milliseconds
    const millis = Math.round(milliseconds % 1000);

    // Pad the values to the desired format
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMillis = millis.toString().padStart(3, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMillis}`;
  }

  private roundPercent(num: number): string {
    return Math.floor(Math.round(num * 10000) / 100).toString();
  }


  private buildServerHTML(
    server: Server,
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