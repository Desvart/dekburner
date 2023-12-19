export class Config {
  static readonly CONTRACT_PUBLICATION_PORT: number = 2;
  static readonly SOLUTION_PUBLICATION_PORT: number = 3;
  static readonly WAIT_TIME_BETWEEN_SCRAPPING: number = 5 * 60 * 1000; // 5 minutes
  static readonly PUBLICATION_BATCH_SIZE: number = 5;
  static readonly WAIT_TIME_TO_NEXT_PUBLICATION: number = 5 * 1000; // 5 seconds

  static readonly DEBUG_MODE: boolean = true;
}

export class Constants {
  static readonly MODULE_NAME: string = "MOD-CONTRACTS";
  static readonly SCRAPPER_SUBMODULE_NAME: string = Constants.MODULE_NAME + " SCRAPPER -";
  static readonly SOLVER_SUBMODULE_NAME: string = Constants.MODULE_NAME + " SOLVER -";
  static readonly SUBMITTER_SUBMODULE_NAME: string = Constants.MODULE_NAME + " SUBMITTER -";
  static readonly HOME_HOSTNAME: string = "home";
  static readonly CONTRACT_FILE_EXTENSION: string = ".cct";
  static readonly CONTRACT_TYPES = {
    FIND_LARGEST_PRIME_FACTOR: "Find Largest Prime Factor",
    SUBARRAY_WITH_MAXIMUM_SUM: "Subarray with Maximum Sum",
    TOTAL_WAYS_TO_SUM: "Total Ways to Sum",
    TOTAL_WAYS_TO_SUM_II: "Total Ways to Sum II",
    SPIRALIZE_MATRIX: "Spiralize Matrix",
    ARRAY_JUMPING_GAME: "Array Jumping Game",
    ARRAY_JUMPING_GAME_II: "Array Jumping Game II",
    MERGE_OVERLAPPING_INTERVALS: "Merge Overlapping Intervals",
    GENERATE_IP_ADDRESSES: "Generate IP Addresses",
    ALGORITHMIC_STOCK_TRADER_I: "Algorithmic Stock Trader I",
    ALGORITHMIC_STOCK_TRADER_II: "Algorithmic Stock Trader II",
    ALGORITHMIC_STOCK_TRADER_III: "Algorithmic Stock Trader III",
    ALGORITHMIC_STOCK_TRADER_IV: "Algorithmic Stock Trader IV",
    MINIMUM_PATH_SUM_IN_A_TRIANGLE: "Minimum Path Sum in a Triangle",
    UNIQUE_PATHS_IN_A_GRID_I: "Unique Paths in a Grid I",
    UNIQUE_PATHS_IN_A_GRID_II: "Unique Paths in a Grid II",
    SHORTEST_PATH_IN_A_GRID: "Shortest Path in a Grid",
    SANITIZE_PARENTHESES_IN_EXPRESSION: "Sanitize Parentheses in Expression",
    FIND_ALL_VALID_MATH_EXPRESSIONS: "Find All Valid Math Expressions",
    HAMMINGCODES_INTEGER_TO_ENCODED_BINARY: "HammingCodes: Integer to Encoded Binary",
    HAMMINGCODES_ENCODED_BINARY_TO_INTEGER: "HammingCodes: Encoded Binary to Integer",
    PROPER_2_COLORING_OF_A_GRAPH: "Proper 2-Coloring of a Graph",
    COMPRESSION_I_RLE_COMPRESSION: "Compression I: RLE Compression",
    COMPRESSION_II_LZ_DECOMPRESSION: "Compression II: LZ Decompression",
    COMPRESSION_III_LZ_COMPRESSION: "Compression III: LZ Compression",
    ENCRYPTION_I_CAESAR_CIPHER: "Encryption I: Caesar Cipher",
    ENCRYPTION_II_VIGENERE_CIPHER: "Encryption II: Vigenère Cipher",
    UNKNOWN: "Unknown"
  };
}
