import { NS as INs } from "@ns";
import { IProblemSolution } from "/mod-contracts/src/solver-service/ISolver";

export class NsAdapter {
  constructor(private readonly ns: INs) {}

  isQueueEmpty(port: number): boolean {
    return this.ns.peek(port) === "NULL PORT DATA";
  }

  readQueue(port: number): string {
    return this.ns.readPort(port) as string;
  }

  async wait(loopInterval: number): Promise<void> {
    await this.ns.sleep(loopInterval);
  }

  attemptSolution(solution: IProblemSolution, fileName: string, hostname: string) {
    return this.ns.codingcontract.attempt(solution as any[], fileName, hostname);
  }

  print(log: string) {
    this.ns.print(log);
  }

  async waitForPortData(contractPort: number) {
    await this.ns.getPortHandle(contractPort).nextWrite();
  }
}
