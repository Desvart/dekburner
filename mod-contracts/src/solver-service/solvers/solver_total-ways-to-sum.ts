import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_totalWaysToSum implements IProblemSolver {
  /* Total Ways to Sum I
     It is possible write four as a sum in exactly four different ways:
       3 + 1  ;  2 + 2  ;  2 + 1 + 1  ;  1 + 1 + 1 + 1
     How many different distinct ways can the number 72 be written as a sum of at least two positive integers? */

  /* Total Ways to Sum II
     How many different distinct ways can the number 87 be written as a sum of integers contained in the set:
       [3,4,7,8,9,10,11,13]?
     You may use each integer in the set zero or more times.
  */

  solve(input: [number, number[]]): number {
    // Solution: dynamic programming approach

    // Split the input into n and the numbers to adapt for problem I and II
    const n: number = input[0];
    const numbers: number[] = input[1];

    // Create a 1D array for dynamic programming (dp)
    let dp: number[] = new Array(n + 1).fill(0);
    dp[0] = 1; // Base case: one way to sum up to 0

    // Fill the dynamic programming table
    for (let num of numbers) {
      for (let i = num; i <= n; i++) {
        dp[i] += dp[i - num];
      }
    }

    // The number of ways to write 'input' using numbers up to 'input' or numbers in the given set
    return dp[n];
  }
}