import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_encryptionIIVigenere implements IProblemSolver {
  /* Vigenère cipher is a type of polyalphabetic substitution. It uses the Vigenère square to encrypt and decrypt
     plaintext with a keyword.

     Vigenère square:
         A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
       +----------------------------------------------------
     A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
     B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
     C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
     D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
     E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
                ...
     Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
     Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y

     For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword. For
     example, the plaintext DASHBOARD is encrypted with the keyword LINUX:

     Plaintext: DASHBOARD
     Keyword:   LINUXLINU
     So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the Vigenère
     square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.

     You are given an array with two elements:
      ["FRAMELOGINPOPUPENTERLINUX", "REALTIME"]
     The first element is the plaintext, the second element is the keyword.

     Return the ciphertext as uppercase string.
  */

  solve(input: [string, string]): string {
    const plaintext = input[0].toUpperCase();
    let keyword = input[1].toUpperCase();
    let ciphertext = '';

    // Extend the keyword to match the length of the plaintext
    while (keyword.length < plaintext.length) {
      keyword += keyword;
    }
    keyword = keyword.substring(0, plaintext.length);

    for (let i = 0; i < plaintext.length; i++) {
      const plainChar = plaintext.charCodeAt(i) - 'A'.charCodeAt(0);
      const keyChar = keyword.charCodeAt(i) - 'A'.charCodeAt(0);
      if (plainChar >= 0 && plainChar < 26) { // Ensure character is a letter
        const cipherChar = (plainChar + keyChar) % 26;
        ciphertext += String.fromCharCode(cipherChar + 'A'.charCodeAt(0));
      } else {
        // Non-letter characters are copied as-is
        ciphertext += plaintext[i];
      }
    }

    return ciphertext;
  }
}