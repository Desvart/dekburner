import { NS as INs } from '@ns';

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  ns.clearPort(2);
  ns.clearPort(3);
  await ns.sleep(1000);
  // ns.run('utils/queue-monitor/@app.js', 1, 2);
  // await ns.sleep(1000);
  // ns.run('utils/queue-monitor/@app.js', 1, 3);
  // await ns.sleep(1000);
  // ns.run('contracts/solver-service/@service.js');
  // await ns.sleep(1000);
  // ns.run('contracts/scrapper/@daemon.js');
}