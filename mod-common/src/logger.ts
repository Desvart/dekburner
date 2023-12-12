import { NS as INs } from '@ns';

export class Logger {
    oldConsoleDebug: (...data: any[]) => void = console.debug;

    constructor(private readonly ns: INs ) {}

    setupDebugMode(debug_mode: boolean): void {
        if (!debug_mode) {
            this.disableLogger();
            return;
        }
        this.ns.tail();
    }

    disableLogger(): void {
        console.debug = (): void => { };
    }

    resetDebugMode(): void {
        console.debug = this.oldConsoleDebug;
    }
}