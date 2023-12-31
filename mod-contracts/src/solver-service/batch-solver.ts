import {
  IContractDTO,
  ISolvedContractDTO,
} from "/mod-contracts/src/common/IContractDTO";
import { Constants } from "/mod-contracts/src/common/config";
import { ContractSolver } from "/mod-contracts/src/solver-service/contract-solver";
import { Solver_subarrayWithMaximumSum } from "/mod-contracts/src/solver-service/solvers/solver_subarray-with-maximum-sum";
import { Solver_totalWaysToSum } from "/mod-contracts/src/solver-service/solvers/solver_total-ways-to-sum";
import { Solver_spiralizeMatrix } from "/mod-contracts/src/solver-service/solvers/solver_spiralize-matrix";
import { Solver_arrayJumpingGame } from "/mod-contracts/src/solver-service/solvers/solver_array-jumping-game";
import { Solver_empty } from "/mod-contracts/src/solver-service/solvers/solver_empty";
import { Solver_arrayJumpingGameII } from "/mod-contracts/src/solver-service/solvers/solver_array-jumping-game-II";
import {
  Solver_mergeOverlappingIntervals
} from "/mod-contracts/src/solver-service/solvers/solver_merge-overlapping-intervals";
import { Solver_generateIpAddresses } from "/mod-contracts/src/solver-service/solvers/solver_generate-ip-addresses";
import {
  Solver_minimumPathSumInATriangle
} from "/mod-contracts/src/solver-service/solvers/solver_minimum-path-sum-in-a-triangle";
import {
  Solver_sanitizeParenthesesInExpression
} from "/mod-contracts/src/solver-service/solvers/solver_sanitize-parentheses-in-expression";
import {
  Solver_findLargestPrimeNumber
} from "/mod-contracts/src/solver-service/solvers/solver_find-largest-prime-number";
import { Solver_shortestPathInAGrid } from "/mod-contracts/src/solver-service/solvers/solver_shortest-path-in-a-grid";
import {
  Solver_findAllValidMathExpressions
} from "/mod-contracts/src/solver-service/solvers/solver_find-all-valid-math-expressions";
import {
  Solver_proper2ColoringOfAGraph
} from "/mod-contracts/src/solver-service/solvers/solver_proper-2-coloring-of-a-graph";
import { Solver_encryptionICaesar } from "/mod-contracts/src/solver-service/solvers/solver_encryption-I-caesar";
import { Solver_encryptionIIVigenere } from "/mod-contracts/src/solver-service/solvers/solver_encryption-II-vigenere";
import {
  Solver_hammingcodeEncodedIntegerToBinary
} from "/mod-contracts/src/solver-service/solvers/solver_hammingcode-encoded-integer-to-binary";
import {
  Solver_hammingcodeEncodedBinarytoInteger
} from "/mod-contracts/src/solver-service/solvers/solver_hammingcode-encoded-binary-to-integer";
import { Solver_uniquePathInAGrid } from "/mod-contracts/src/solver-service/solvers/solver_unique-path-in-a-grid";
import { Solver_compressionI } from "/mod-contracts/src/solver-service/solvers/solver_compression_I";
import { Solver_compressionII } from "/mod-contracts/src/solver-service/solvers/solver_compression_II";
import { Solver_compressionIII } from "/mod-contracts/src/solver-service/solvers/solver_compression_III";
import {
  Solver_algorithmicStockTrader
} from "/mod-contracts/src/solver-service/solvers/solver_algorithmic-stock-trader";

export class BatchSolver {
  solve(contracts: IContractDTO[]): ISolvedContractDTO[] {
    console.debug(Constants.SOLVER_SUBMODULE_NAME, `Solving batch of contracts:`, contracts);
    let solvedcontracts: ISolvedContractDTO[] = contracts.map(
      (contract: IContractDTO): ISolvedContractDTO => {
        const contractSolver: ContractSolver = this.findSolver(contract.type);
        const solvedContract: ISolvedContractDTO = contractSolver.solve(contract);
        return solvedContract;
      },
    );

    solvedcontracts = this.filterOutUnknownContracts(solvedcontracts);
    console.debug(Constants.SOLVER_SUBMODULE_NAME, `Solved contracts:`, solvedcontracts);
    return solvedcontracts;
  }

  public findSolver(contractType: string): ContractSolver { // todo: make private
    console.debug(Constants.SOLVER_SUBMODULE_NAME, `Finding solver for contract ${contractType}`);
    let solver: ContractSolver | undefined = this.ContractSolvers.find(
      (solver) => solver.contractName === contractType,
    );
    if (!solver) {
      console.warn(Constants.SOLVER_SUBMODULE_NAME, `Solver not found for contract ${contractType}`);
      solver = new ContractSolver(
        Constants.CONTRACT_TYPES.UNKNOWN,
        new Solver_empty(),
      )
    }
    console.debug(Constants.SOLVER_SUBMODULE_NAME, `Solver found for contract ${contractType}:`, solver);
    return solver;
  }

  private filterOutUnknownContracts(solvedContracts: ISolvedContractDTO[]): ISolvedContractDTO[] {
    const solvedContractsWithoutUnknow = solvedContracts.filter(
      (solvedContract) => solvedContract.solution !== 'UNKNOWN',
    );
    console.debug(Constants.SOLVER_SUBMODULE_NAME, `Removed ${solvedContracts.length-solvedContractsWithoutUnknow.length} unknown contracts from batch of contracts`);
    console.debug(Constants.SOLVER_SUBMODULE_NAME, 'Solved contracts with unknown contracts:', solvedContracts);
    console.debug(Constants.SOLVER_SUBMODULE_NAME, 'Solved contracts without unknown contracts:', solvedContractsWithoutUnknow);
    return solvedContractsWithoutUnknow;
  }

  private ContractSolvers: ContractSolver[] = [
    new ContractSolver(
      Constants.CONTRACT_TYPES.FIND_LARGEST_PRIME_FACTOR,
      new Solver_findLargestPrimeNumber(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.SUBARRAY_WITH_MAXIMUM_SUM,
      new Solver_subarrayWithMaximumSum(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.TOTAL_WAYS_TO_SUM,
      new Solver_totalWaysToSum(),
      (data) => [data, [...Array.from({ length: data - 1 }, (_, i) => i + 1)]],
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.TOTAL_WAYS_TO_SUM_II,
  new Solver_totalWaysToSum()
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.SPIRALIZE_MATRIX,
  new Solver_spiralizeMatrix(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ARRAY_JUMPING_GAME,
      new Solver_arrayJumpingGame(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ARRAY_JUMPING_GAME_II,
      new Solver_arrayJumpingGameII(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.MERGE_OVERLAPPING_INTERVALS,
      new Solver_mergeOverlappingIntervals(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.GENERATE_IP_ADDRESSES,
      new Solver_generateIpAddresses(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_I,
      new Solver_algorithmicStockTrader(),
      (data) => [1, data],
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_II,
      new Solver_algorithmicStockTrader(),
      (data) => [data.length, data],
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_III,
      new Solver_algorithmicStockTrader(),
      (data) => [2, data],
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_IV,
      new Solver_algorithmicStockTrader(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.MINIMUM_PATH_SUM_IN_A_TRIANGLE,
      new Solver_minimumPathSumInATriangle(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.UNIQUE_PATHS_IN_A_GRID_I,
      new Solver_uniquePathInAGrid(),
      (data) =>
        Array(data[0])
          .fill(null)
          .map(() => Array(data[1]).fill(0)),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.UNIQUE_PATHS_IN_A_GRID_II,
      new Solver_uniquePathInAGrid(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.SHORTEST_PATH_IN_A_GRID,
      new Solver_shortestPathInAGrid(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.SANITIZE_PARENTHESES_IN_EXPRESSION,
      new Solver_sanitizeParenthesesInExpression(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.FIND_ALL_VALID_MATH_EXPRESSIONS,
      new Solver_findAllValidMathExpressions(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.HAMMINGCODES_INTEGER_TO_ENCODED_BINARY,
      new Solver_hammingcodeEncodedIntegerToBinary(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.HAMMINGCODES_ENCODED_BINARY_TO_INTEGER,
      new Solver_hammingcodeEncodedBinarytoInteger(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.PROPER_2_COLORING_OF_A_GRAPH,
      new Solver_proper2ColoringOfAGraph(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.COMPRESSION_I_RLE_COMPRESSION,
      new Solver_compressionI(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.COMPRESSION_II_LZ_DECOMPRESSION,
      new Solver_compressionII(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.COMPRESSION_III_LZ_COMPRESSION,
      new Solver_compressionIII(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ENCRYPTION_I_CAESAR_CIPHER,
      new Solver_encryptionICaesar(),
    ),
    new ContractSolver(
      Constants.CONTRACT_TYPES.ENCRYPTION_II_VIGENERE_CIPHER,
      new Solver_encryptionIIVigenere(),
    ),
  ];
}
