import { NS as INs } from '@ns';
import { Display } from "/mod-network/src/network-monitor/display";
import { Network } from "/mod-network/src/network-monitor/network";

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