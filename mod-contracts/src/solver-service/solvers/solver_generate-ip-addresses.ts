import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_generateIpAddresses implements IProblemSolver {
  /* Given the following string containing only digits, return an array with all possible valid IP address combinations
     that can be created from the string: 16413453
     Note that an octet cannot begin with a '0' unless the number itself is actually 0. For example, '192.168.010.1' is
     not a valid IP.
     Examples:
     25525511135 -> ["255.255.11.135", "255.255.111.35"]
     1938718066 -> ["193.87.180.66"]
  */

  solve(input: string): string[] {
    const result: string[] = [];

    function backtrack(start: number, path: string[], parts: number): void {
      if (parts === 4 && start === input.length) {
        result.push(path.join("."));
        return;
      }

      if (parts === 4 || start === input.length) {
        return;
      }

      for (let len = 1; len <= 3; len++) {
        if (start + len > input.length) break; // Avoid going past the string length

        const segment = input.substring(start, start + len);

        // Check if the segment is a valid IP octet
        if (
          (segment.length > 1 && segment.startsWith("0")) ||
          Number(segment) > 255
        ) {
          break;
        }

        path.push(segment);
        backtrack(start + len, path, parts + 1);
        path.pop(); // Backtrack
      }
    }

    backtrack(0, [], 0);
    return result;
  }
}
