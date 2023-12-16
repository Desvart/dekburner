import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_arrayJumpingGame implements IProblemSolver {
  /* You are given the following array of integers:
     0,7,10,5,1,0,1,0,0,1,0,10,2,1,7,0,5,9,3,6,10,0,0,6
     Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at
     position i and your maximum jump length is n, you can jump to any position from i to i+n.
     Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last
     index. Your answer should be submitted as 1 or 0, representing true and false respectively
  */

  solve(input: number[]): number {
    let maxReach = 0;
    const n = input.length;

    for (let i = 0; i < n; i++) {

      if (this.isTheCurrentIndexBeyondTheMaximumReachableIndex(i, maxReach)) {
        return 0;
      }

      maxReach = this.updateMaximumReachableIndex(maxReach, i, input[i])

      if (this.isTheMaximumReachableIndexBeyondTheEndOfTheArray(maxReach, n)) {
        return 1;
      }
    }

    return 0; // If we finish the loop without reaching the end, we cannot reach the end
  }

  private isTheCurrentIndexBeyondTheMaximumReachableIndex(currentIndex: number, maximumReachableIndex: number): boolean {
    return currentIndex > maximumReachableIndex;
  }

  private updateMaximumReachableIndex(maximumReachableIndex: number, currentIndex: number, jumpLength: number): number {
    return Math.max(maximumReachableIndex, currentIndex + jumpLength);
  }

  private isTheMaximumReachableIndexBeyondTheEndOfTheArray(maximumReachableIndex: number, arrayLength: number): boolean {
    return maximumReachableIndex >= arrayLength - 1;
  }
}