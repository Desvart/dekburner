import {NS as INs} from '@ns';

export async function main(ns: INs) {
    ns.tail();
    ns.disableLog('ALL');
    ns.clearLog();
    
    const refreshRate: number = ns.args[0] as number || 1000;
    const doc = eval('document');
    
    // Since there is no specific anchor in a log window, we need to create one by printing a specific text in the log window.
    const anchorStr: string = `Refreshing every ${refreshRate/1000} seconds...`;
    ns.print(anchorStr);
    await ns.sleep(200);
    
    // Once the text is printed and can be used as an anchor for our XPath, we inject an empty <p> element into above the previously injected log
    // This empty element will be used to inject our HTML in it.
    const anchorId: string = 'scanAnchor';
    const container = `<p class="MuiTypography-root MuiTypography-body1 css-cxl1tz" id="${anchorId}"></p>`;
    const xpath = `//span[contains(text(), "${anchorStr}")]`;
    const matchingElement = <HTMLElement>doc.evaluate(xpath, doc, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    matchingElement.insertAdjacentHTML('beforebegin', container);
    
    // Retrieve our empty element and inject the HTML code generated above. Refresh the information each x seconds.
    const tag = doc.querySelector('#'+anchorId);
    
    // noinspection InfiniteLoopJS
    do {
        const network: Server[] = new NetworkBuilder(ns).build();
        tag.innerHTML = getNetworkAsHTML(ns, network);
        await ns.sleep(refreshRate);
    } while (true)
}

function getNetworkAsHTML(ns: INs, network: Server[]) {
    
    // network.sort((a, b) => (b.isHome ? 1 : 0) - (a.isHome ? 1 : 0)); //sort by parent-child relationships
    // network.sort((a, b) => a.depth - b.depth); //sort by depth
    network.sort((a, b) => (b.isHome ? 1 : 0) - (a.isHome ? 1 : 0) || (a.level - b.level) || (b.money.max - a.money.max));
    let output = `<div style='font-size: 10px'>`;
    
    for (let server of network) {
        
        // Color of the square in front of the server name.
        // Red = no admin rights and not nukable
        // Yellow = no admin rights but nukable
        // Blue = admin but not backdoor
        // Green = admin and backdoor
        let hackColor = 'red';
        hackColor = server.canBeNuked ? 'yellow' : hackColor;
        hackColor = server.isRoot ? 'cyan' : hackColor;
        hackColor = (server.backdoor || server.isHome || server.purchased) ? 'lime' : hackColor;
    
        // Color the server names based on the factions
        const facServers: { [key: string]: string } = {
            "CSEC" : "yellow",
            "avmnite-02h" : "yellow",
            "I.I.I.I" : "yellow",
            "run4theh111z" : "yellow",
            "The-Cave" : "orange",
            "w0r1d_d43m0n" : "red"
        };
        let nameColor = facServers[server.id] ? facServers[server.id] : "white";
        
        // Provide technical information about the server when hovering the mouse
        let hoverText = [
            "Req Level: ", server.level,
            "&#10;Req Ports: ", server.requiredPorts,
            "&#10;Memory: ", server.ram.max, "GB",
            "&#10;Security: ", server.security.level, "/", server.security.min,
            "&#10;Money: ", ns.nFormat(server.money.available, "$0.000a"), " (", Math.round((server.money.available / server.money.max) * 100), "%)"
        ].join("");
        
        // Provide list of available contracts on each server
        let contractText = "";
        ns.ls(server.id, ".cct").forEach(contractName => {
            contractText += [
                "<a title='", contractName,
                "&#10;", ns.codingcontract.getContractType(contractName, server.id),
                "'>©</a>"].join("");
        });
        
        output += [
            // `<span style="color: black">` + "--".repeat(server.depth) + `</span>`, // For display indentation
            `<span style="color: black">` + "--" + `</span>`, // For display indentation
            `<span style='color:${hackColor}'>■ </span>`,
            `<a class='scan-analyze-link' title='${hoverText}''

            // On click connect directly to the server. Requires "connect.js" script and goto alias to work
            onClick="(function()
            {
                const doc = eval('document');
                const terminalInput = doc.getElementById('terminal-input');
                terminalInput.value='home; goto ${server.id}';
                const handler = Object.keys(terminalInput)[1];
                terminalInput[handler].onChange({target:terminalInput});
                terminalInput[handler].onKeyDown({key:'Enter',preventDefault:()=>null});
            })();"
            
            style='color:${nameColor}'>${server.id}</a> `,
            `<span style='color:fuchsia'>${contractText}</span>`,
            "<br>"
        ].join("");
    }
    
    return output + "</div>";
}

export class NetworkBuilder {
    constructor(private readonly ns: INs) {}

    private retrieveHostnamesAndDepth(
      currentServer: string = 'home',
      scannedServers: Map<string, number> = new Map().set('home', 0)): Map<string, number> {
        const serversToScan = this.ns.scan(currentServer).filter(node => !scannedServers.has(node));
        for (let nodeName of serversToScan) {
            const depth: number = scannedServers.get(currentServer) as number + 1;
            scannedServers.set(nodeName, depth);
            this.retrieveHostnamesAndDepth(nodeName, scannedServers);
        }
        return scannedServers;
    }

    public build(): Server[] {
        let network: Server[] = [];
        this.retrieveHostnamesAndDepth().forEach((depth, id) => network.push(new Server(this.ns, id, depth)));
        // put 'home' server at the end of the list
        network.sort((a, b) => (a.isHome ? 1 : 0) - (b.isHome ? 1 : 0));
        return network;
    }
}

class Server {
    readonly level: number;
    readonly requiredPorts: number;
    readonly purchased: boolean;
    readonly isHome: boolean;
    readonly ram: Ram;
    readonly security: Security;
    readonly money: Money;
    readonly hk: Hack;
    // readonly gw: Grow;
    // readonly wk: Weaken;
    readonly growth: number;

    constructor(private readonly ns: INs, readonly id: string, readonly depth: number) {
        this.ram = new Ram(ns, id);
        this.security = new Security(ns, id);
        this.money = new Money(ns, id);
        this.level = ns.getServer(id).requiredHackingSkill as number;
        this.requiredPorts = ns.getServer(id).numOpenPortsRequired as number;
        this.purchased = ns.getServer(id).purchasedByPlayer;
        this.isHome = (id === 'home');
        this.hk = new Hack(ns, id);
        // this.gw = new Grow(ns, id);
        // this.wk = new Weaken(ns, id);
        this.growth = ns.getServer(id).serverGrowth as number;
    }

    get cores(): number {
        return this.ns.getServer(this.id).cpuCores;
    }

    get isTarget(): boolean {
        return (
          !this.purchased &&
          !this.isHome &&
          (this.money.max > 0) && this.isRoot
        );
    }

    get backdoor(): boolean {
        return this.ns.getServer(this.id).backdoorInstalled as boolean;
    }

    get isRoot(): boolean {
        return this.ns.getServer(this.id).hasAdminRights;
    }

    get canBeNuked(): boolean {
        const data = this.ns.getPlayer();
        return (!this.isRoot && data.skills.hacking >= this.level && this.portsKeyCount >= this.requiredPorts);
    }

    get portsKeyCount() {
        return this.ns.ls('home').filter(file => [
            'BruteSSH.exe',
            'FTPCrack.exe',
            'relaySMTP.exe',
            'HTTPWorm.exe',
            'SQLInject.exe',
        ].includes(file)).length;
    }

    get canExecScripts(): boolean {
        return (this.isRoot && this.ram.max > 0);
    }
}

class Ram {
    readonly max: number;

    constructor(private readonly ns: INs, private readonly serverId: string) {
        this.max = ns.getServer(serverId).maxRam;
    }

    get used(): number {
        return this.ns.getServer(this.serverId).ramUsed;
    }
}

class Security {
    readonly min: number;

    constructor(private readonly ns: INs, private readonly serverId: string) {
        this.min = ns.getServer(serverId).minDifficulty as number;
    }

    get level(): number {
        return this.ns.getServer(this.serverId).hackDifficulty as number;
    }
}

class Money {
    readonly max: number;
    readonly growth: number;

    constructor(private readonly ns: INs, private readonly serverId: string) {
        this.max = ns.getServer(serverId).moneyMax as number;
        this.growth = ns.getServer(serverId).serverGrowth as number;
    }

    get available(): number {
        return this.ns.getServer(this.serverId).moneyAvailable as number;
    }
}

class Hack {
    constructor(private readonly ns: INs, private readonly serverId: string) {}

    get duration(): number {
        return this.ns.getHackTime(this.serverId);
    }

    get durationStr(): string {
        return this.ns.tFormat(this.duration);
    }

    get chance(): number {
        return this.ns.hackAnalyzeChance(this.serverId);
    }
}