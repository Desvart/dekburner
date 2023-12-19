import { Solver_generateIpAddresses } from "../../../src/solver-service/solvers/solver_generate-ip-addresses";

describe("Generate IP addresses", () => {
  const cases = [
    { input: "25525511135", expected: ["255.255.11.135", "255.255.111.35"] },
    { input: "1938718066", expected: ["193.87.180.66"] }
  ];

  it.each(cases)(`should return $expected when data is $data`, async ({input, expected}) => {
    // Arrange
    const solver = new Solver_generateIpAddresses();

    // Act
    const result = solver.solve(input);

    // Assert
    expect(result).toStrictEqual(expected);
  });
});
