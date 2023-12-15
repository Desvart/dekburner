import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_totalWaysToSum implements IProblemSolver {
  /* It is possible write four as a sum in exactly four different ways:

    3 + 1
    2 + 2
    2 + 1 + 1
    1 + 1 + 1 + 1

How many different distinct ways can the number 72 be written as a sum of at least two positive integers? */

  solve(input: number): number {
    // Solution: dynamic programming approach

    // Create a 2D array for dynamic programming (dp)
    let dp: number[][] = Array.from({ length: input + 1 }, () =>
      Array(input + 1).fill(0),
    );

    // That's one possible way to write 0 as a sum (with no numbers)
    for (let i = 0; i <= input; i++) {
      dp[i][0] = 1;
    }

    // Fill the dynamic programming table
    for (let i = 1; i < input; i++) {
      for (let j = 1; j <= input; j++) {
        if (j >= i) {
          dp[i][j] = dp[i - 1][j] + dp[i][j - i];
        } else {
          dp[i][j] = dp[i - 1][j];
        }
      }
    }

    // The number of ways to write 'input' using numbers up to 'input'
    return dp[input - 1][input]; // Don't subtract 1 to include the partition 'input' itself
  }
}
