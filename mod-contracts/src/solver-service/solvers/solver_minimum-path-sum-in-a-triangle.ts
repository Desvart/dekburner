import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_minimumPathSumInATriangle implements IProblemSolver {
  /*Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to
  adjacent numbers in the row below. The triangle is represented as a 2D array of numbers:
  [
       [1],
      [2,9],
     [9,2,2],
    [4,8,7,5]
  ]
  Example: If you are given the following triangle:
  [
       [2],
      [3,4],
     [6,5,7],
    [4,1,8,3]
  ]
  The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
  */

  solve(input: number[][]): number {
    const n = input.length;
    const dp: number[] = input[n - 1].slice(); // Copy the last row

    // Start from the second-to-last row and move upwards
    for (let row = n - 2; row >= 0; row--) {
      for (let col = 0; col <= row; col++) {
        // Update the path sum for each element in the current row
        dp[col] = input[row][col] + Math.min(dp[col], dp[col + 1]);
      }
    }

    return dp[0]; // The top element contains the minimum path sum
  }

}