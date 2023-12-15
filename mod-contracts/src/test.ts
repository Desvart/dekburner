import { NS as INs } from "@ns";
import { Solver_subarrayWithMaximumSum } from "/mod-contracts/src/solver-service/solvers/solver_subarray-with-maximum-sum";
import { Solver_totalWaysToSum } from "/mod-contracts/src/solver-service/solvers/solver_total-ways-to-sum";

// TODO: generate the output already in ci folder and then delete all other files AND reformat import

/** @param {NS} ns */
export async function main(ns: INs): Promise<void> {
  ns.tail();
  ns.disableLog("ALL");
  ns.clearLog();

  const qty: number = (ns.args[0] as number) || 1;

  //const contractTypes = ns.codingcontract.getContractTypes();
  //ns.print(contractTypes);

  testContractSolver("Total Ways to Sum", qty, ns);
}

function testContractSolver(type: string, qty: number, ns: INs): void {
  const solver = new Solver_totalWaysToSum();
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

    const solution = solver.solve(data);
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
