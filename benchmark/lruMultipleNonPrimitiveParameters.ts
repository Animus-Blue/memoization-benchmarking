import { Bench } from "tinybench";
import { memoizeWithLimit as sonic } from "sonic-memoize";
import moize from "moize";
import memoizee from "memoizee";
import micro from "micro-memoize";
import memoizerific from "memoizerific";
import { printResults, randomOrderArray1, randomOrderArray2 } from "./utils";

const library = process.argv[2];

async function runBenchmark() {
  function expensiveFunction({ string }, { num }, { bool }) {
    // We make this function not expensive in order to get results that reflect the performance
    // of the memoization libraries, not the time it takes for the expensive function to run.
    return string;
  }

  const args: [{ string: string }, { num: number }, { bool: boolean }][] = [];
  for (let i = 1000000000; i < 1000000200; i++) {
    let a = { string: i.toString() };
    let b1 = { num: i };
    let b2 = { num: i + 1 };
    let b3 = { num: i + 2 };
    let c1 = { bool: true };
    let c2 = { bool: false };
    args.push([a, b1, c1]);
    args.push([a, b1, c2]);
    args.push([a, b2, c1]);
    args.push([a, b2, c2]);
    args.push([a, b3, c1]);
  }

  const args1: [{ string: string }, { num: number }, { bool: boolean }][] =
    randomOrderArray1.map(
      (i) => args.find((arg, index) => index === i - 1000000000)!
    );
  const args1b: [{ string: string }, { num: number }, { bool: boolean }][] =
    randomOrderArray2.map(
      (i) => args.find((arg, index) => index === i - 1000000000)!
    );

  const args2: [{ string: string }, { num: number }, { bool: boolean }][] = [];
  for (let i = 1000001000; i < 1000001200; i++) {
    let a = { string: i.toString() };
    let b1 = { num: i };
    let b2 = { num: i + 1 };
    let b3 = { num: i + 2 };
    let c1 = { bool: true };
    let c2 = { bool: false };
    args2.push([a, b1, c1]);
    args2.push([a, b1, c2]);
    args2.push([a, b2, c1]);
    args2.push([a, b2, c2]);
    args2.push([a, b3, c1]);
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
    memoized(...arg);
  }
  let i = 0;
  bench
    .add(`accessing 1000 values from cache (cache hits)`, () => {
      const thisArgs = ++i % 2 === 0 ? args1 : args1b;
      for (const arg of thisArgs) {
        memoized(...arg);
      }
    })
    .add(`adding 1000 new values (cache misses)`, () => {
      const thisArgs = ++i % 2 === 0 ? args1 : args2;
      for (const arg of thisArgs) {
        memoized(...arg);
      }
    });
  await bench.run();
  tasks.push(...bench.tasks);
  console.log(
    `${name} results for function with multiple non primitive parameter:`
  );
  printResults(tasks);
}

runBenchmark();
