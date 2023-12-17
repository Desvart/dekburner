import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_mergeOverlappingIntervals implements IProblemSolver {
  /* Given the following array of arrays of numbers representing a list of intervals, merge all overlapping intervals.
  [[14,24],[21,24],[18,22],[17,21],[19,24],[10,13]]
  Example: [[1, 3], [8, 10], [2, 6], [10, 16]] would merge into [[1, 6], [8, 16]].
  The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always
  be smaller than the second.
  */

  solve(input: number[][]): number[][] {
    if (input.length <= 1) {
      return input;
    }

    // Sort intervals based on the start time
    input.sort((a, b) => a[0] - b[0]);

    const merged: number[][] = [];
    let currentInterval = input[0];

    for (let i = 1; i < input.length; i++) {
      const [currentStart, currentEnd] = currentInterval;
      const [nextStart, nextEnd] = input[i];

      if (currentEnd >= nextStart) {
        // Merge overlapping intervals
        currentInterval = [currentStart, Math.max(currentEnd, nextEnd)];
      } else {
        // Add the non-overlapping interval to the result and update the current interval
        merged.push(currentInterval);
        currentInterval = input[i];
      }
    }

    // Add the last interval
    merged.push(currentInterval);

    return merged;
  }
}