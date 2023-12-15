import { NsAdapter } from "/mod-contracts/src/scrapper/ns-adapter";
import { CodingContractData } from "@ns";
import { IContractDTO } from "/mod-contracts/src/common/IContractDTO";

export class Contract {

  type: string = '';
  data: CodingContractData = '';

  constructor(
    private readonly nsA: NsAdapter,
    public readonly fileName: string,
    public readonly hostname: string
  ) {
    this.getContractInfo();
  }

  getContractInfo(): void {
    this.type = this.nsA.getContractType(this.fileName, this.hostname);
    this.data = this.nsA.getContractData(this.fileName, this.hostname);
  }
  
  toDTO(): IContractDTO {
    const { fileName, hostname, type, data } = this;
    return { fileName, hostname, type, data };
  }

}
