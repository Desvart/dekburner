import { NS as INs } from '@ns';

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  const queueId: number = (ns.args[0] as number) || 1;
  const refreshRate: number = (ns.args[1] as number) || 1000;

  const display: Display = new Display(ns, refreshRate);
  display.build();
  await display.show(queueId);
}

class Display {
  constructor(
    private readonly ns: INs,
    private readonly refreshRate: number
  ) {}

  build(): void {
    this.ns.tail();
    this.ns.disableLog('ALL');
    this.ns.clearLog();
  }

  async show(queueId: number): Promise<void> {
    let exitCondition: boolean = false;
    do {
      this.updateDisplay(queueId);
      await this.ns.sleep(this.refreshRate);
    } while (!exitCondition);
  }

  private updateDisplay(queueId: number): void {
    const data = this.ns.peek(queueId);
    this.ns.clearLog();
    this.ns.print(data);
  }
}
