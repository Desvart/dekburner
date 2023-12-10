import { NS } from '@ns';

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.print('Hello World!');
}

class HacknetFarmingWithoutFormulas {

  constructor(private readonly nsA: NsAdapter) {
  }

  async startFarming() {
    do {
      const upgrade= this.identifyCheapestUpgrade();
      await this.buyIfConditionReached(upgrade);
    } while (this.farmingExitCriteria());
    // loop until server owned = 30
    // identify cheapest upgrade
    // buy cheapest upgrade
  }

  identifyCheapestUpgrade(): IUpgrade {
    const upgrades = this.getAllUpgrades();
    return this.identifyCheapest(upgrades);
  }

  getAllUpgrades(): IUpgrade[] {
  return [
    { id: 0, type: UpgradeType.CORES, price: 0 },
    { id: 1, type: UpgradeType.CORES, price: 0 },
  ];
  }


  async buyIfConditionReached(upgrade: IUpgrade) {
    while(!this.areBuyConditionsMet(upgrade)) {
      const waitingTime = this.computeWaitingTime(upgrade.price);
      await this.nsA.waitMinutes(waitingTime);
    }
    this.buyUpgrade(upgrade);
  }

  private farmingExitCriteria(): boolean {
    return false;
  }


  private identifyCheapest(upgrades: IUpgrade[]): IUpgrade {
    return { id: 0, type: UpgradeType.CORES, price: 0 };
  }

  private buyUpgrade(upgrade: IUpgrade): void {
    return undefined;
  }

  private computeWaitingTime(price: number): number {
    return 0;
  }

  private areBuyConditionsMet(upgrade: IUpgrade): boolean {
    return false;
  }
}

interface IUpgrade {
  id: number;
  type: UpgradeType;
  price: number;
}

enum UpgradeType {
  NODES = 'NODES',
  LEVEL = 'LEVEL',
  RAM = 'RAM',
  CORES = 'CORES',
}

class NsAdapter {
  constructor(public readonly ns: NS) {

  }

  async waitMinutes(waitingTime: any): Promise<void> {
    await this.ns.sleep(waitingTime);
  }
}


