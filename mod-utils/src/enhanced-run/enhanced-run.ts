import { NS as INs } from "@ns";

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  const args = ns.args;
  if (args.length === 0) {
    return ns.tprint("You must run this script with an argument that is the code to run.");
  }

  const command = String(args.join(''));
  const script =
    `export async function main(ns) { 
      ns.tprint(JSON.stringify(${command})); 
    }`;

  const tmpFileName: string = "tmp-script.js";
  ns.write(tmpFileName, script, "w");
  ns.run(tmpFileName, 1);
  ns.rm(tmpFileName);
}