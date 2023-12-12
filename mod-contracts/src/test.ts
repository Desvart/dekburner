import { Logger } from "/mod-common/src/logger";
import { NS as INs } from "@ns";
import { Config } from "/mod-contracts/src/common/config";

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {

  console.info(' ');

  const logger = new Logger(ns);

  console.info('INFO - Before');
  console.debug('DEBUG - Before');

  logger.setupDebugMode(Config.DEBUG_MODE);

  console.debug('DEBUG - After');
  console.info('INFO - After');

  logger.resetDebugMode();

}


