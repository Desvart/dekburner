import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_hammingcodeEncodedIntegerToBinary
  implements IProblemSolver
{
  /* You are given the following decimal Value:
6390
Convert it to a binary representation and encode it as an 'extended Hamming code'. Eg:
Value 8 is expressed in binary as '1000', which will be encoded with the pattern 'pppdpddd', where p is a parity bit and d a data bit. The encoding of
8 is 11110000. As another example, '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.
The answer should be given as a string containing only 1s and 0s.
NOTE: the endianness of the data bits is reversed in relation to the endianness of the parity bits.
NOTE: The bit at index zero is the overall parity bit, this should be set last.
NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which explains the 'rule' of encoding, including the first index parity bit mentioned in the previous note.

Extra rule for encoding:
There should be no leading zeros in the 'data bit' section
  */

  solve(value: number): string {
    const binaryData = value.toString(2).split("");
    const totalParityBits = this.calculateTotalParityBits(binaryData.length);
    const encoded = this.initializeEncodedArray(binaryData, totalParityBits);

    // Calculate parity for each parity bit position
    const parityBitPositions = this.getParityBitPositions(encoded);
    for (const index of parityBitPositions) {
      encoded[index] = this.calculateParity(encoded, index).toString();
    }

    // Calculate and set the overall parity bit
    encoded.unshift(this.calculateOverallParity(encoded).toString());
    return encoded.join("");
  }

  private calculateTotalParityBits(lengthOfDataBits: number): number {
    // Implement the Hamming sum of parity bits calculation
    if (lengthOfDataBits < 3) {
      return lengthOfDataBits + 1;
    }

    const doubleLength = lengthOfDataBits * 2;
    const log2Double = Math.ceil(Math.log2(doubleLength));
    const log2Single = Math.ceil(Math.log2(1 + lengthOfDataBits + Math.ceil(Math.log2(lengthOfDataBits))));

    return log2Double <= log2Single ? Math.ceil(Math.log2(lengthOfDataBits) + 1) : Math.ceil(Math.log2(lengthOfDataBits));
  }

  private initializeEncodedArray(data: string[], totalParityBits: number): string[] {
    // Initialize encoded array with placeholders for parity bits
    let encoded = ['x', 'x', ...data.splice(0, 1)];
    for (let i = 2; i < totalParityBits; i++) {
      encoded.push('x', ...data.splice(0, Math.pow(2, i) - 1));
    }
    return encoded;
  }

  private getParityBitPositions(encoded: string[]): number[] {
    // Get indices of parity bits in the encoded array
    return encoded
      .map((element, index) => element === 'x' ? index : -1)
      .filter(index => index !== -1);
  }

  private calculateParity(encoded: string[], parityIndex: number): number {
    // Calculate parity for a given parity bit position
    let count = 0;
    for (let i = parityIndex; i < encoded.length; i += (parityIndex + 1) * 2) {
      for (let j = i; j < i + parityIndex + 1 && j < encoded.length; j++) {
        if (encoded[j] === '1') {
          count++;
        }
      }
    }
    return count % 2;
  }

  private calculateOverallParity(encoded: string[]): number {
    // Calculate overall parity for the encoded data
    return encoded.filter(bit => bit === '1').length % 2;
  }
}