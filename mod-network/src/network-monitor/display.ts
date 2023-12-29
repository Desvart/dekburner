import { NS as INs } from '@ns';
import { Network } from "/mod-network/src/network-monitor/network";
import { ConverterNetworkToHtml } from "/mod-network/src/network-monitor/converter-network-to-html";

export class Display {
  private doc: any;
  private readonly anchor: string;
  readonly anchorId: string = 'scanAnchor';
  private tag: HTMLElement;

  constructor(
    private readonly ns: INs,
    private readonly refreshRate: number
  ) {
    this.doc = eval('document');
    this.anchor = `Refreshing every ${this.refreshRate / 1000} seconds...`;
    this.tag = this.doc.createElement('p');
  }

  async injectAnchorInLogWindow(): Promise<void> {
    this.ns.print(this.anchor);
    await this.ns.sleep(200);
  }

  injectEmptyContainerBeforeAnchor(): void {
    const container: string = `<p class="MuiTypography-root MuiTypography-body1 css-cxl1tz" id="${this.anchorId}"></p>`;
    const xpath: string = `//span[contains(text(), "${this.anchor}")]`;
    const matchingElement: HTMLElement = <HTMLElement>(
      this.doc.evaluate(xpath, this.doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue
    );
    matchingElement.insertAdjacentHTML('beforebegin', container);
    this.tag = this.doc.querySelector('#' + this.anchorId);
  }

  async build(): Promise<void> {
    await this.injectAnchorInLogWindow();
    this.injectEmptyContainerBeforeAnchor();
  }

  updateDisplay(content: string): void {
    this.tag.innerHTML = content;
  }

  async show(network: Network): Promise<void> {
    let exitCondition: boolean = false;
    const networkHtml = new ConverterNetworkToHtml(network);
    do {
      this.updateDisplay(networkHtml.buildHTMLContent());
      await this.ns.sleep(this.refreshRate);
    } while (!exitCondition);
  }
}
