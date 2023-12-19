import { Solver_sanitizeParenthesesInExpression } from "../../../src/solver-service/solvers/solver_sanitize-parentheses-in-expression";
import { Solver_sanitizeParenthesesInExpression2 } from "../../../src/solver-service/solvers/solver_sanitize-parentheses-in-expression2";

describe("Sanitize parentheses in expression", () => {
  const cases = [
    { input: "()())()", expected: ["()()()", "(())()"] },
    { input: "(a)())()", expected: ["(a)()()", "(a())()"] },
    { input: ")(", expected: [""] },
    { input: "(()((a)", expected: [""] },
  ];

  it.each(cases)(`should return $expected when data is $data`, async ({input, expected}) => {
    // Arrange
    const solver = new Solver_sanitizeParenthesesInExpression();
    const solver2 = new Solver_sanitizeParenthesesInExpression2();

    // Act
    const result1 = solver.solve(input);
    const result2 = solver2.solve(input);

    // Assert
    expect(result1).toEqual(expected);
    //expect(result2).toEqual(expected);
  });
});
