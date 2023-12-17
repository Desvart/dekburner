import { CodingContractData } from "@ns";
import { Solver_arrayJumpingGameII } from "../../../src/solver-service/solvers/solver_array-jumping-game-II";

describe("Array Jumping Game II", () => {
  const cases = [{ data: [2,1,2,3,2,2,3,2,3], expected: 5 }];

  it.each(cases)(
    `should return $expected when data is $data`,
    async ({ data, expected }) => {
      // Arrange
      const solver = new Solver_arrayJumpingGameII();
      const input: CodingContractData = data;

      // Act
      const result = solver.solve(input);

      // Assert
      expect(result).toBe(expected);
    },
  );
});

