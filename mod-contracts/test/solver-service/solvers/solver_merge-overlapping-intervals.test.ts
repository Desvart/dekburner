import { CodingContractData } from "@ns";
import {
  Solver_mergeOverlappingIntervals
} from "../../../src/solver-service/solvers/solver_merge-overlapping-intervals";

describe("Merging Overlapping Intervals", () => {
  const cases = [
    { data: [[1, 3], [8, 10], [2, 6], [10, 16]], expected: [[1, 6], [8, 16]] },
    { data: [[14,24],[21,24],[18,22],[17,21],[19,24],[10,13]], expected: [[10, 13], [14, 24]] }
  ];

  it.each(cases)(
    `should return $expected when data is $data`,
    async ({ data, expected }) => {
      // Arrange
      const solver = new Solver_mergeOverlappingIntervals();
      const input: CodingContractData = data;

      // Act
      const result = solver.solve(input);
      debugger
      // Assert
      expect(result).toStrictEqual(expected);
    },
  );
});

