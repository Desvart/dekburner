import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_empty implements IProblemSolver {

  solve(): string {
    return "UNKNOWN";
  }

}