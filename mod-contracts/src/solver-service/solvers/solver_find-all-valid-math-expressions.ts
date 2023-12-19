import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_findAllValidMathExpressions implements IProblemSolver {
  /* You are given the following string which contains only digits between 0 and 9: 844148866399
     You are also given a target number of -2. Return all possible ways you can add the +(add), -(subtract), and
     *(multiply) operators to the string such that it evaluates to the target number. (Normal order of operations
     applies.)
     The provided answer should be an array of strings containing the valid expressions. The data provided by this
     problem is an array with two elements. The first element is the string of digits, while the second element is the
     target number: ["844148866399", -2]
     NOTE: The order of evaluation expects script operator precedence
     NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression
     Examples:

      Input: digits = "123", target = 6
      Output: [1+2+3, 1*2*3]

      Input: digits = "105", target = 5
      Output: [1*0+5, 10-5]
   */


  solve(input: [string, number]): string[] {
    const digits = input[0];
    const target = input[1];

    function helper(res: string[], path: string, digits: string, target: number, pos: number, evaluated: number, multed: number) {
      if (pos === digits.length) {
        if (target === evaluated) {
          res.push(path)
        }
        return
      }
      for (let i = pos; i < digits.length; ++i) {
        if (i != pos && digits[pos] == '0') {
          break
        }
        const cur = parseInt(digits.substring(pos, i + 1))
        if (pos === 0) {
          helper(res, path + cur, digits, target, i + 1, cur, cur)
        } else {
          helper(res, path + '+' + cur, digits, target, i + 1, evaluated + cur, cur)
          helper(res, path + '-' + cur, digits, target, i + 1, evaluated - cur, -cur)
          helper(res, path + '*' + cur, digits, target, i + 1, evaluated - multed + multed * cur, multed * cur)
        }
      }
    }

    if (digits == null || digits.length === 0) {
      return []
    }
    const result: string[] = []
    helper(result, '', digits, target, 0, 0, 0)
    return result
  }
}