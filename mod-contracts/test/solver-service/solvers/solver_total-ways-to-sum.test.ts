import { Solver_totalWaysToSum } from "../../../src/solver-service/solvers/solver_total-ways-to-sum";
import { CodingContractData } from "@ns";

describe("Total ways to sum", () => {
  const cases = [{ data: 72, expected: 5392782 }];

  it.each(cases)(
    `should return $expected when data is $data`,
    async ({ data, expected }) => {
      // Arrange
      const solver = new Solver_totalWaysToSum();
      const input: CodingContractData = [
        data,
        [...Array.from({ length: data - 1 }, (_, i) => i + 1)],
      ];

      // Act
      const result = solver.solve(input);

      // Assert
      expect(result).toBe(expected);
    },
  );
});

describe("Total ways to sum II", () => {
  const cases = [
    { data: [75, [2, 3, 4, 6, 7, 8, 9, 10, 11, 12]], expected: 62754 },
    { data: [20,[1,2,4,5,6,8,9,12,14,15,16,18]], expected: 216 },
    { data: [187,[1,2,3,4,5,9,15,18,19,20,23,27]], expected: 110657261 }
  ];

  it.each(cases)(
    `should return $expected when data is $data`,
    async ({ data, expected }) => {
      // Arrange
      const solver = new Solver_totalWaysToSum();
      const input: CodingContractData = data;

      // Act
      const result = solver.solve(input);

      // Assert
      expect(result).toBe(expected);
    },
  );
});
