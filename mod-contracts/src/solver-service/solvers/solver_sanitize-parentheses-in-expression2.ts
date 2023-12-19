import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_sanitizeParenthesesInExpression2 implements IProblemSolver {
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

  solve(data: string): string[] {
    let left = 0
    let right = 0
    const res:string[] = []
    for (let i = 0; i < data.length; ++i) {
      if (data[i] === '(') {
        ++left
      } else if (data[i] === ')') {
        left > 0 ? --left : ++right
      }
    }

    function dfs(pair:number, index:number, left:number, right:number, s:string, solution:string, res:string[]) {
      if (s.length === index) {
        if (left === 0 && right === 0 && pair === 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i] === solution) {
              return
            }
          }
          res.push(solution)
        }
        return
      }
      if (s[index] === '(') {
        if (left > 0) {
          dfs(pair, index + 1, left - 1, right, s, solution, res)
        }
        dfs(pair + 1, index + 1, left, right, s, solution + s[index], res)
      } else if (s[index] === ')') {
        if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res)
        if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res)
      } else {
        dfs(pair, index + 1, left, right, s, solution + s[index], res)
      }
    }
    dfs(0, 0, left, right, data, '', res)

    return res
  }
}