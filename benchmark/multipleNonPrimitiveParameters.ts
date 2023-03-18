import { Bench } from "tinybench";
import sonic from "sonic-memoize";
import nano from "nano-memoize";
import fast from "fast-memoize";
import memoizee from "memoizee";
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

  const memoizationFunctions = [
    { name: "sonic-memoize", func: sonic },
    { name: "fast-memoize", func: fast },
    { name: "memoizee", func: memoizee },
    { name: "nano-memoize", func: nano },
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
    .add(`initializing and adding 1000 new values`, () => {
      const mem = func(expensiveFunction);
      for (const arg of args1) {
        mem(...arg);
      }
    })
    .add(`accessing 1000 values from cache`, () => {
      const thisArgs = ++i % 2 === 0 ? args1 : args1b;
      for (const arg of thisArgs) {
        memoized(...arg);
      }
    });
  await bench.run();
  tasks.push(...bench.tasks);
  console.log(
    `${name} results for function with multiple non primitive parameters:`
  );
  printResults(tasks);
}

runBenchmark();
