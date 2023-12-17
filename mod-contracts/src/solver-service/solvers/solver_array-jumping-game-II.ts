import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_arrayJumpingGameII implements IProblemSolver {
  /* You are given the following array of integers: 2,1,2,3,2,2,3,2,3
     Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at
     position i and your maximum jump length is n, you can jump to any position from i to i+n.
     Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach
     the end of the array. If it's impossible to reach the end, then the answer should be 0.
  */

  solve(input: number[]): number {
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;

    for (let i = 0; i < input.length - 1; i++) {
      farthest = Math.max(farthest, i + input[i]);

      // If we've reached the end of the current jump,
      // increase the jump count and update the current end
      if (i === currentEnd) {
        jumps++;
        currentEnd = farthest;

        // If the current end is still at or before the current position,
        // it means we can't move further, so return 0
        if (currentEnd <= i) return 0;
      }
    }

    return jumps;
  }
}