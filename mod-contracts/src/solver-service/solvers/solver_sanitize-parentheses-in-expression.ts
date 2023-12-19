import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_sanitizeParenthesesInExpression implements IProblemSolver {
  /* Given the following string: (()((a)a))()())a(
     remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal
     ways to validate the string, provide all of the possible results. The answer should be provided as an array of
     strings. If it is impossible to validate the string the result should be an array with only an empty string.
     IMPORTANT: The string may contain letters, not just parentheses. Examples:
     "()())()" -> ["()()()", "(())()"]
     "(a)())()" -> ["(a)()()", "(a())()"]
     ")(" -> [""]
  */

  results = new Set<string>();

  solve(input: string): string[] {
    this.results = new Set<string>();

    // Count the number of misplaced left and right parentheses
    let lremove = 0, rremove = 0;
    for (let char of input) {
      if (char === '(') lremove++;
      else if (char === ')') {
        if (lremove > 0) lremove--;
        else rremove++;
      }
    }

    this.backtrack(0, lremove, rremove, input);
    return Array.from(this.results);
  }

  isValid(str: string): boolean {
    let balance = 0;
    for (let char of str) {
      if (char === '(') balance++;
      else if (char === ')') balance--;
      if (balance < 0) return false; // More closing parentheses
    }
    return balance === 0; // Perfectly balanced
  }

  backtrack(start: number, lremove: number, rremove: number, str: string): void {
    if (lremove === 0 && rremove === 0) {
      if (this.isValid(str)) {
        this.results.add(str);
      }
      return;
    }

    for (let i = start; i < str.length; i++) {
      // Skip duplicates
      if (i !== start && str[i] === str[i - 1]) continue;

      if (str[i] === '(' && lremove > 0) {
        // Remove the current left parenthesis
        this.backtrack(i, lremove - 1, rremove, str.substring(0, i) + str.substring(i + 1));
      }

      if (str[i] === ')' && rremove > 0) {
        // Remove the current right parenthesis
        this.backtrack(i, lremove, rremove - 1, str.substring(0, i) + str.substring(i + 1));
      }
    }
  }
}