import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_encryptionICaesar implements IProblemSolver {
  /* Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each
     letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example,
     with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).
     You are given an array with two elements: ["DEBUG LOGIN ARRAY TRASH QUEUE", 14]
     The first element is the plaintext, the second element is the left shift value.
     Return the ciphertext as uppercase string. Spaces remains the same.
  */

  solve(input: [string, number]): string {
    const [text, shift] = input;
    return text.split('').map(char => this.encryptCharacter(char, shift)).join('');
  }

  private encryptCharacter(char: string, shift: number): string {
    if (char === ' ') return char;

    const charCode = char.charCodeAt(0);
    if (charCode >= 65 && charCode <= 90) {
      // Uppercase A-Z in ASCII is 65-90
      return String.fromCharCode((charCode - 65 - shift + 26) % 26 + 65);
    }
    return char; // Non-alphabetic characters are returned as is
  }
}