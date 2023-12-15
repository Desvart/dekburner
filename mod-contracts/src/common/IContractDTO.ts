import { CodingContractData } from "@ns";
import { IProblemSolution } from "/mod-contracts/src/solver-service/ISolver";

export interface IContractDTO {
  fileName: string;
  hostname: string;
  type: string;
  data: CodingContractData;
}

export interface ISolvedContractDTO extends IContractDTO {
  solution: IProblemSolution;
}