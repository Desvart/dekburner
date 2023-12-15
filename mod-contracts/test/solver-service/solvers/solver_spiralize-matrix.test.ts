import { Solver_spiralizeMatrix } from "../../../src/solver-service/solvers/solver_spiralize-matrix";

describe("Spiralize matrics", () => {
  const cases = [
    { input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], expected: [1, 2, 3, 6, 9, 8 ,7, 4, 5] },
    { input: [[1,  2,  3,  4], [5,  6,  7,  8], [9, 10, 11, 12]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
  ];

  it.each(cases)(`should return $expected when data is $data`, async ({input, expected}) => {
    // Arrange
    const solver = new Solver_spiralizeMatrix();

    // Act
    const result = solver.solve(input);

    // Assert
    expect(result).toEqual(expected);
  });
});
