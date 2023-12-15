import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_spiralizeMatrix implements IProblemSolver {
  /* Given an array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:
     Here is an example of what spiral order should be:
      [ [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]  ]

     Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]
     Note that the matrix will not always be square:
  */

  solve(input: number[][]): number[] {
    let result: number[] = [];

    while (input.length) {
      result = this.addTheFirstRow(input, result);
      result = this.addTheLastElementOfEachRow(input, result);
      result = this.addTheLastRowInReverseOrder(input, result);
      result = this.addFirstElementOfEachRowInReverseOrder(input, result);
    }

    return result;
  }

  private addFirstElementOfEachRowInReverseOrder(input: number[][], result: number[]) {
    let firstElements: number[] = [];
    for (let i = 0; i < input.length; i++) {
      let row = input[i];
      if (row.length) {
        firstElements.push(row.shift() as number);
      }
    }
    return result.concat(firstElements.reverse());
  }

  private addTheLastRowInReverseOrder(input: number[][], result: number[]) {
    if (input.length) {
      let lastRow = input.pop() as number[];
      result = result.concat(lastRow.reverse());
    }
    return result;
  }

  private addTheLastElementOfEachRow(input: number[][], result: number[]) {
    for (let i = 0; i < input.length; i++) {
      let row = input[i];
      if (row.length) {
        result.push(row.pop() as number);
      }
    }
    return result;
  }

  private addTheFirstRow(input: number[][], result: number[]): number[] {
    return result.concat(input.shift() as number[]);
  }
}