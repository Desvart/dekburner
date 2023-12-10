import { CodingContractData } from "@ns";

export interface IContractDTO {
  fileName: string;
  hostname: string;
  type: string;
  data: CodingContractData;
}