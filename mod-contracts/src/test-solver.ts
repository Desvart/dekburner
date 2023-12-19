import { CodingContractData, NS as INs } from "@ns";
import { Solver_subarrayWithMaximumSum } from "/mod-contracts/src/solver-service/solvers/solver_subarray-with-maximum-sum";
import { Solver_totalWaysToSum } from "/mod-contracts/src/solver-service/solvers/solver_total-ways-to-sum";
import { Solver_spiralizeMatrix } from "/mod-contracts/src/solver-service/solvers/solver_spiralize-matrix";
import { Solver_arrayJumpingGameII } from "/mod-contracts/src/solver-service/solvers/solver_array-jumping-game-II";
import {
  Solver_mergeOverlappingIntervals
} from "/mod-contracts/src/solver-service/solvers/solver_merge-overlapping-intervals";
import { BatchSolver } from "/mod-contracts/src/solver-service/batch-solver";
import { Contract } from "/mod-contracts/src/scrapper/contract";

// TODO: generate the output already in ci folder and then delete all other files AND reformat import

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  ns.tail();
  ns.disableLog("ALL");
  ns.clearLog();

  const type: string = (ns.args[0] as string);
  const qty: number = (ns.args[1] as number) || 1;

  testContractSolver(type, qty, ns);
}

function testContractSolver(type: string, qty: number, ns: INs): void {
  const solver = new BatchSolver().findSolver(type);

  for (let i = 0; i < qty; i++) {
    ns.print(`Contract type: ${type}`);
    ns.print(`Iteration ${i + 1} of ${qty}`);

    ns.codingcontract.createDummyContract(type);
    const fileName = ns.ls("home", ".cct")[0];
    const contractType = ns.codingcontract.getContractType(fileName, "home");

    if (contractType !== type) {
      ns.print(`Contract type ${contractType} does not match ${type}`);
      continue;
    }

    const data = ns.codingcontract.getData(fileName, "home");
    ns.print(`Data: ${data}`);

    // const convertedData = convertData(data);
    // ns.print(`Converted data: ${convertedData}`);

    const solvedContract = solver.solve({  fileName: fileName, hostname: 'home', type: type, data: data});
    ns.print(`Solved contract: ${solvedContract}`);

    const answer = ns.codingcontract.attempt(solvedContract.solution as unknown as any[], fileName, "home");

    const isAnswerValid = answer !== "";
    ns.print(`Answer: ${isAnswerValid ? "✅" : "❌"}`);

    if (!isAnswerValid) {
      break;
    } else {
      ns.clearLog();
    }

    if(i === qty - 1) {
      ns.print(`Load testing solver ${type}...}`)
      ns.print(`All ${i+1} iterations completed successfully.`);
    }
  }
}

function convertData(data: number[][]): number[][] {
  return data
}

