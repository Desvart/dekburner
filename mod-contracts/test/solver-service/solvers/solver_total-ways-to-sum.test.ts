import { Solver_totalWaysToSum } from "../../../src/solver-service/solvers/solver_total-ways-to-sum";

describe("Total ways to sum", () => {
  const cases = [
    { input: 72, expected: 5392782 }
  ];

  it.each(cases)(`should return $expected when data is $data`, async ({input, expected}) => {
    // Arrange
    const solver = new Solver_totalWaysToSum();

    // Act
    const result = solver.solve(input);

    // Assert
    expect(result).toBe(expected);
  });
});
