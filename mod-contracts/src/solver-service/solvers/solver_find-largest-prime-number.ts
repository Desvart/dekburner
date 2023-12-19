import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_findLargestPrimeNumber implements IProblemSolver {
  /* A prime factor is a factor that is a prime number. What is the largest prime factor of 251187194?
  */

  solve(input: number): number {

    let largestFactor = 1;

    // Remove factors of 2
    while (input % 2 === 0) {
      largestFactor = 2;
      input /= 2;
    }

    // Check odd factors
    let factor = 3;
    const maxFactor = Math.sqrt(input);
    while (input > 1 && factor <= maxFactor) {
      while (input % factor === 0) {
        largestFactor = factor;
        input /= factor;
      }
      factor += 2;
    }

    // If X is a prime number greater than 2
    if (input > 2) {
      largestFactor = input;
    }

    return largestFactor;
  }
}
