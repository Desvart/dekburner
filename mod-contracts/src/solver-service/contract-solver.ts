import { CodingContractData } from "@ns";
import {
  IContractDTO,
  ISolvedContractDTO,
} from "/mod-contracts/src/common/IContractDTO";
import { IProblemSolution, IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class ContractSolver {
  constructor(
    readonly contractName: string,
    private readonly solver: IProblemSolver,
    private readonly formatInput: (
      data: CodingContractData
    ) => CodingContractData = (data) => data,
  ) {}

  solve(contract: IContractDTO): ISolvedContractDTO {
    const input: CodingContractData = this.formatInput(contract.data);
    const problemSolution: IProblemSolution = this.solver.solve(input);
    return this.packageSolution(problemSolution, contract);
  }

  private packageSolution(solution: IProblemSolution, contract: IContractDTO): ISolvedContractDTO {
    return {
      ...contract,
      solution,
    };
  }
}
