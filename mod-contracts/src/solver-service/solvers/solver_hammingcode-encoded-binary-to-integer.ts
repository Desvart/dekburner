import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_hammingcodeEncodedBinarytoInteger implements IProblemSolver {
  solve(data: string): number {
    const binaryArray = data.split("");
    const parityCheckResults = [];
    const totalParityBits = Math.ceil(Math.log2(data.length));

    let overallParity = binaryArray.splice(0, 1).join("");
    parityCheckResults.push(this.checkParity(overallParity, binaryArray));

    for (let i = 0; i < totalParityBits; i++) {
      parityCheckResults.push(this.checkParityAtIndex(binaryArray, i));
    }

    const correctedIndex = this.calculateCorrectionIndex(parityCheckResults, totalParityBits);
    binaryArray.unshift(overallParity);

    if (correctedIndex > 0 && !parityCheckResults[0]) {
      this.toggleBitAtIndex(binaryArray, correctedIndex);
    } else if (!parityCheckResults[0]) {
      overallParity = overallParity === "0" ? "1" : "0";
    } else if (parityCheckResults[0] && parityCheckResults.some(truth => !truth)) {
      return 0; // ERROR: More than one altered bit detected.
    }

    this.removeParityBits(binaryArray, totalParityBits);
    return parseInt(binaryArray.join(""), 2);
  }

  private countBits(arr: string[], val: string): number {
    return arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  }

  private checkParity(overallParity: string, data: string[]): boolean {
    return overallParity === (this.countBits(data, "1") % 2).toString();
  }

  private checkParityAtIndex(data: string[], index: number): boolean {
    const parityBitIndex = Math.pow(2, index) - 1;
    const stepSize = parityBitIndex + 1;
    const parityData = [];

    for (let i = parityBitIndex; i < data.length; i += stepSize * 2) {
      parityData.push(...data.slice(i, i + stepSize));
    }

    const parityBit = parityData.shift();
    return parityBit === (this.countBits(parityData, "1") % 2).toString();
  }

  private calculateCorrectionIndex(checkResults: boolean[], totalParityBits: number): number {
    let correctionIndex = 0;
    for (let i = 1; i <= totalParityBits; i++) {
      correctionIndex += checkResults[i] ? 0 : Math.pow(2, i) / 2;
    }
    return correctionIndex;
  }

  private toggleBitAtIndex(arr: string[], index: number): void {
    arr[index] = arr[index] === "0" ? "1" : "0";
  }

  private removeParityBits(arr: string[], totalParityBits: number): void {
    for (let i = totalParityBits; i >= 0; i--) {
      arr.splice(Math.pow(2, i), 1);
    }
    arr.splice(0, 1); // Remove overall parity bit
  }
}
