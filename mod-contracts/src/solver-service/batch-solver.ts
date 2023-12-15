import {
  IContractDTO,
  ISolvedContractDTO,
} from "/mod-contracts/src/common/IContractDTO";
import { Constants } from "/mod-contracts/src/common/config";
import { ContractSolver } from "/mod-contracts/src/solver-service/contract-solver";
import { Solver_subarrayWithMaximumSum } from "/mod-contracts/src/solver-service/solvers/solver_subarray-with-maximum-sum";
import { Solver_totalWaysToSum } from "/mod-contracts/src/solver-service/solvers/solver_total-ways-to-sum";

export class BatchSolver {
  solve(contracts: IContractDTO[]): ISolvedContractDTO[] {
    const solvedcontracts: ISolvedContractDTO[] = contracts.map(
      (contract: IContractDTO): ISolvedContractDTO => {
        const contractSolver: ContractSolver = this.findSolver(contract.type);
        const solvedContract: ISolvedContractDTO =
          contractSolver.solve(contract);
        return solvedContract;
      },
    );

    return solvedcontracts;
  }

  findSolver(contractType: string): ContractSolver {
    const solver: ContractSolver | undefined = this.ContractSolvers.find(
      (solver) => solver.contractName === contractType,
    );
    if (!solver) {
      throw new Error(`Solver not found for contract ${contractType}`);
    }
    return solver;
  }

  private ContractSolvers: ContractSolver[] = [
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
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.SPIRALIZE_MATRIX,
  // new Solver_spiralizeMatrix(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ARRAY_JUMPING_GAME,
  //     new Solver_arrayJumpingGame(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ARRAY_JUMPING_GAME_II,
  //     new Solver_arrayJumpingGameII(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.MERGE_OVERLAPPING_INTERVALS,
  //     new Solver_mergeOverlappingIntervals(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.GENERATE_IP_ADDRESSES,
  //     new Solver_generateIpAddresses(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_I,
  //     new Solver_algorithmicStockTraderI(),
  //     (data) => [1, data],
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_II,
  //     new Solver_algorithmicStockTraderII(),
  //     (data) => [data.length, data],
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_III,
  //     new Solver_algorithmicStockTraderIII(),
  //     (data) => [2, data],
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ALGORITHMIC_STOCK_TRADER_IV,
  //     new Solver_algorithmicStockTraderIV(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.MINIMUM_PATH_SUM_IN_A_TRIANGLE,
  //     new Solver_minimumPathSumInATriangle(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.UNIQUE_PATHS_IN_A_GRID_I,
  //     new Solver_uniquePathsInAGridI(),
  //     (data) =>
  //       Array(data[0])
  //         .fill(null)
  //         .map(() => Array(data[1]).fill(0)),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.UNIQUE_PATHS_IN_A_GRID_II,
  //     new Solver_uniquePathsInAGridII(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.SHORTEST_PATH_IN_A_GRID,
  //     new Solver_shortestPathInAGrid(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.SANITIZE_PARENTHESES_IN_EXPRESSION,
  //     new Solver_sanitizeParenthesesInExpression(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.FIND_ALL_VALID_MATH_EXPRESSIONS,
  //     new Solver_findAllValidMathExpressions(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.HAMMINGCODES_INTEGER_TO_ENCODED_BINARY,
  //     new Solver_hammingcodesI2B(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.HAMMINGCODES_ENCODED_BINARY_TO_INTEGER,
  //     new Solver_hammingcodesB2I(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.PROPER_2_COLORING_OF_A_GRAPH,
  //     new Solver_proper2ColoringOfAGraph(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.COMPRESSION_I_RLE_COMPRESSION,
  //     new Solver_compressionI(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.COMPRESSION_II_LZ_DECOMPRESSION,
  //     new Solver_compressionII(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.COMPRESSION_III_LZ_COMPRESSION,
  //     new Solver_compressionIII(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ENCRYPTION_I_CAESAR_CIPHER,
  //     new Solver_encryptionI(),
  //   ),
  //   new ContractSolver(
  //     Constants.CONTRACT_TYPES.ENCRYPTION_II_VIGENERE_CIPHER,
  //     new Solver_encryptionII(),
  //   ),
  ];
}
