import { Solver_subarrayWithMaximumSum } from "../../../src/solver-service/solvers/solver_subarray-with-maximum-sum";

describe("Sub-array with maximum sum", () => {
  const cases = [
    { input: [1, 2, 3, 4, 5], expected: 15 },
    { input: [-6, -7, -7, 0, -6], expected: 0 },
    { input: [-10, -3, -2, -2, -4], expected: -2 },
    { input: [0,-7,-8,-3,8,8,0,0,8,-10,2,5,9,-5,3,-5,-4,1,-8,-7,9,-6], expected: 30 },
  ];

  it.each(cases)(`should return $expected when data is $data`, async ({input, expected}) => {
    // Arrange
    const solver = new Solver_subarrayWithMaximumSum();

    // Act
    const result = solver.solve(input);

    // Assert
    expect(result).toBe(expected);
  });
});
