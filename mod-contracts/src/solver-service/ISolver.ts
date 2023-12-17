import { CodingContractData as ICodingContractData} from "@ns";

export type IProblemSolution = number | number[] | number[][] | string | string[] | boolean | boolean[];

export interface IProblemSolver {
  solve(contractData: ICodingContractData): IProblemSolution
}

