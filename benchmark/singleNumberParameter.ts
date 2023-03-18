import { Bench } from "tinybench";
import sonic from "sonic-memoize";
import nano from "nano-memoize";
import fast from "fast-memoize";
import memoizee from "memoizee";
import mem from "mem";
import lodash from "lodash.memoize";
import { printResults, randomOrderArray1, randomOrderArray2 } from "./utils";

const library = process.argv[2];

async function runBenchmark() {
  function expensiveFunction(value: number) {
    // We make this function not expensive in order to get results that reflect the performance
    // of the memoization libraries, not the time it takes for the expensive function to run.
    return value;
  }

  const args1: number[] = randomOrderArray1;
  const args1b: number[] = randomOrderArray2;

  const memoizationFunctions = [
    { name: "sonic-memoize", func: sonic },
    { name: "nano-memoize", func: nano },
    { name: "mem", func: mem },
    { name: "lodash.memoize", func: lodash },
    { name: "fast-memoize", func: fast },
    { name: "memoizee", func: memoizee },
  ];
  const tasks: any = [];
  const { name, func } = memoizationFunctions[library];
  const bench = new Bench({ time: 2000 });
  const memoized = func(expensiveFunction);
  for (const arg of args1) {
    memoized(arg);
  }
  let i = 0;
  bench
    .add(`initializing and adding 1000 new values`, () => {
      const mem = func(expensiveFunction);
      for (const arg of args1) {
        mem(arg);
      }
    })
    .add(`accessing 1000 values from cache`, () => {
      const thisArgs = ++i % 2 === 0 ? args1 : args1b;
      for (const arg of thisArgs) {
        memoized(arg);
      }
    });
  await bench.run();
  tasks.push(...bench.tasks);
  console.log(
    `${name} results for function with single parameter of type number:`
  );
  printResults(tasks);
}

runBenchmark();
