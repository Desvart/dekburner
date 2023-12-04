import { NS } from '@ns';

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.print('Hello World!');
}

class HacknetFarmingWithoutFormulas {

  constructor(private readonly nsA: NsAdapter) {
  }

  startFarming() {
    do {
      const upgrade= this.identifyCheapestUpgrade();
      this.buyIfConditionReached(upgrade);
    } while (this.farminExitCriteria());
    // loop until server owned = 30
    // identify cheapest upgrade
    // buy cheapest upgrade
  }

  identifyCheapestUpgrade(): IUpgrade {
    const upgrades = this.getAllUpgrades();
    return this.identifyCheapest(upgrades);
  }

  getAllUpgrades():  {

  }


  buyIfConditionReached(upgrade: IUpgrade) {
    while(!this.buyConditionReached(upgrade)) {
      const waitingTime = this.computeWaitingTime(upgrade.price);
      this.nsA.waitMinutes(waitingTime);
    }
    this.buyUpgrade(upgrade);
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
}


