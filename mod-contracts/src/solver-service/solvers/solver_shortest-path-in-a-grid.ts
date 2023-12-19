import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_shortestPathInAGrid implements IProblemSolver {
  /* You are located in the top-left corner of the following grid:

    [[0,0,0,0,0,0,1,0,0,1,1],
     [0,0,1,0,1,1,0,0,0,0,0],
     [0,0,0,1,0,0,1,1,0,0,0],
     [1,0,0,0,0,0,0,1,0,0,0],
     [0,1,0,0,1,0,1,1,1,1,1],
     [0,0,0,0,1,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0]]

    You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid
    that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

    Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR
    characters, indicating the moves along the path

    NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer
    should be an empty string.
    NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

    Examples:

        [[0,1,0,0,0],
         [0,0,0,1,0]]

    Answer: 'DRRURRD'

        [[0,1],
         [1,0]]

    Answer: ''
  */

  solve(input: number[][]): string {
    const rows = input.length;
    const cols = input[0].length;
    const directions:[number, number, string][] = [[1, 0, 'D'], [-1, 0, 'U'], [0, 1, 'R'], [0, -1, 'L']];
    const queue: Array<[number, number, string]> = [[0, 0, '']];
    const seen = new Set<string>();

    while (queue.length > 0) {
      const [row, col, path] = queue.shift()!;

      if (row === rows - 1 && col === cols - 1) {
        return path;
      }

      for (const [dr, dc, dir] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const newPath = path + dir;
        const pos = `${newRow},${newCol}`;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && input[newRow][newCol] === 0 && !seen.has(pos)) {
          queue.push([newRow, newCol, newPath]);
          seen.add(pos);
        }
      }
    }

    return '';
  }
}
