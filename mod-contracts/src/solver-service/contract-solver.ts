import { CodingContractData } from "@ns";
import {
  IContractDTO,
  ISolvedContractDTO,
} from "/mod-contracts/src/common/IContractDTO";
import { IProblemSolution, IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";
import { Constants } from "/mod-contracts/src/common/config";

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
    console.debug(Constants.SOLVER_SUBMODULE_NAME, 'Input data transformed from', contract.data, 'to', input);

    const problemSolution: IProblemSolution = this.solver.solve(input);
    console.debug(Constants.SOLVER_SUBMODULE_NAME, `Contract ${this.contractName} solved with solution:`, problemSolution);

    const solvedContract: ISolvedContractDTO = this.packageSolution(problemSolution, contract);
    console.debug(Constants.SOLVER_SUBMODULE_NAME, `Contract ${this.contractName} packaged as`, solvedContract);
    return solvedContract;
  }

  private packageSolution(solution: IProblemSolution, contract: IContractDTO): ISolvedContractDTO {
    return {
      ...contract,
      solution,
    };
  }
}
