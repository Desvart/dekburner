export class Logger {
    oldConsoleDebug: (...data: any[]) => void = console.debug;
    setupDebugMode(debug_mode: boolean): void {
        if (!debug_mode) {
            this.disableLogger();
        }
    }

    disableLogger(): void {
        console.debug = (): void => { };
    }

    resetDebugMode(): void {
        console.debug = this.oldConsoleDebug;
    }
}