import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_subarrayWithMaximumSum implements IProblemSolver {
  /* Given the following integer array, find the contiguous subarray (containing at least one number) which has the
    largest sum and return that sum. 'Sum' refers to the sum of all the numbers in the subarray. */

  solve(input: number[]): number {
    // Solution: Kadane's algorithm

      if (input.length === 0) return 0;

      let maxCurrent: number = input[0];
      let maxGlobal: number = input[0];

      for (let i: number = 1; i < input.length; i++) {
        maxCurrent = Math.max(input[i], maxCurrent + input[i]);
        if (maxCurrent > maxGlobal) {
          maxGlobal = maxCurrent;
        }
      }

      return maxGlobal;
    }
}