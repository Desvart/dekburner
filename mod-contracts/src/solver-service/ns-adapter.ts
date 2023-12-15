import { NS as INs } from "@ns";

export class NsAdapter {
  constructor(private readonly ns: INs) {}


  publish(payload: string, contractPort: number): boolean {
    return this.ns.tryWritePort(contractPort, payload);
  }

  isQueueEmpty(port: number): boolean {
    return this.ns.peek(port) === "NULL PORT DATA";
  }

  readQueue(port: number): string {
    return this.ns.readPort(port) as string;
  }

  async wait(loopInterval: number): Promise<void> {
    await this.ns.sleep(loopInterval);
  }
}
