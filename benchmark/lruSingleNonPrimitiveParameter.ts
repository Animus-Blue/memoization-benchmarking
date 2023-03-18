import { Bench } from "tinybench";
import { memoizeWithLimit as sonic } from "sonic-memoize";
import moize from "moize";
import memoizee from "memoizee";
import micro from "micro-memoize";
import memoizerific from "memoizerific";
import { printResults, randomOrderArray1, randomOrderArray2 } from "./utils";

const library = process.argv[2];

async function runBenchmark() {
  function expensiveFunction({ property }) {
    // We make this function not expensive in order to get results that reflect the performance
    // of the memoization libraries, not the time it takes for the expensive function to run.
    return property;
  }

  const args: { property: number }[] = [];
  for (let i = 1000000000; i < 1000001000; i++) {
    args.push({ property: i });
  }

  const args1: { property: number }[] = randomOrderArray1.map(
    (i) => args.find((arg) => arg.property === i)!
  );
  const args1b: { property: number }[] = randomOrderArray2.map(
    (i) => args.find((arg) => arg.property === i)!
  );

  const args2: { property: number }[] = [];
  for (let i = 1000001000; i < 1000002000; i++) {
    args2.push({ property: i });
  }

  const memoizationFunctions = [
    { name: "sonic-memoize", func: (func) => sonic(func, 1000) },
    { name: "memoizerific", func: memoizerific(1000) },
    { name: "memoizee", func: (func) => memoizee(func, { max: 1000 }) },
    { name: "moize", func: (func) => moize(func, { maxSize: 1000 }) },
    { name: "micro-memoize", func: (func) => micro(func, { maxSize: 1000 }) },
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
    .add(`accessing 1000 values from cache (cache hits)`, () => {
      const thisArgs = ++i % 2 === 0 ? args1 : args1b;
      for (const arg of thisArgs) {
        memoized(arg);
      }
    })
    .add(`adding 1000 new values (cache misses)`, () => {
      const thisArgs = ++i % 2 === 0 ? args1 : args2;
      for (const arg of thisArgs) {
        memoized(arg);
      }
    });
  await bench.run();
  tasks.push(...bench.tasks);
  console.log(
    `${name} results for function with single non primitive parameter:`
  );
  printResults(tasks);
}

runBenchmark();
