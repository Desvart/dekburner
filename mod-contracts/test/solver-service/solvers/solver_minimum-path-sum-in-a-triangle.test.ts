import { Solver_minimumPathSumInATriangle } from "../../../src/solver-service/solvers/solver_minimum-path-sum-in-a-triangle";

describe("Minimum path in a triangle", () => {
  const cases = [
    { input: [[2],[3,4],[6,5,7],[4,1,8,3]], expected: 11 },
  ];

  it.each(cases)(`should return $expected when data is $data`, async ({input, expected}) => {
    // Arrange
    const solver = new Solver_minimumPathSumInATriangle();

    // Act
    const result = solver.solve(input);

    // Assert
    expect(result).toStrictEqual(expected);
  });
});
