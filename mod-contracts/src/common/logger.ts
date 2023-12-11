import { Config } from '/mod-contracts/src/common/config';

export function debug(...params: any[]): void {
    if (Config.DEBUG) {
        console.debug(...params);
    }
}