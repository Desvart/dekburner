import { NS as INs } from "@ns";
import { Solver_subarrayWithMaximumSum } from "/mod-contracts/src/solver-service/solvers/solver_subarray-with-maximum-sum";
import { Solver_totalWaysToSum } from "/mod-contracts/src/solver-service/solvers/solver_total-ways-to-sum";
import { Solver_spiralizeMatrix } from "/mod-contracts/src/solver-service/solvers/solver_spiralize-matrix";

// TODO: generate the output already in ci folder and then delete all other files AND reformat import

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  ns.tail();
  ns.disableLog("ALL");
  ns.clearLog();

  const qty: number = (ns.args[0] as number) || 1;

  //const contractTypes = ns.codingcontract.getContractTypes();
  //ns.print(contractTypes);

  testContractSolver("Spiralize Matrix", qty, ns);
}

function testContractSolver(type: string, qty: number, ns: INs): void {
  const solver = new Solver_spiralizeMatrix();
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

    const convertedData = convertData(data);
    ns.print(`Converted data: ${convertedData}`);

    const solution = solver.solve(convertedData);
    ns.print(`Solution: ${solution}`);

    const answer = ns.codingcontract.attempt(solution, fileName, "home");

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

