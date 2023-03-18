# memoization-benchmarking

[benchmark results](#benchmark-results)<br>
[Considerations for realistic benchmarking](#considerations-for-realistic-benchmarking)

## Usage

run npm install first

Benchmarks should be run on single libraries separately, so the memory usage of one library's test does not effect the performance and test results of another library.

### Benchmark memoization of function with single parameter

Tests:

- initialization and calling the memoized function 1000 times with new arguments (testing performance of "adding new values to cache")
- calling the memoized function 1000 times with previously used arguments (testing performance of "reading from cache")

run

- `npm run benchmark:s1 x` for single string parameter function memoization
- `npm run benchmark:s2 x` for single number parameter function memoization
- `npm run benchmark:s3 x` for single non primitive parameter function memoization

replace x with:

- 0 for sonic-memoize
- 1 for nano-memoize
- 2 for mem
- 3 for lodash.memoize
- 4 for fast-memoize
- 5 for memoizee

## Benchmark memoization of function with Multiple parameters

Tests:

- initialization and calling the memoized function 1000 times with new arguments (testing performance of "adding new values to cache")
- calling the memoized function 1000 times with previously used arguments (testing performance of "reading from cache")

- `npm run benchmark:m1 x` for multiple primitive parameters function memoization
- `npm run benchmark:m2 x` for multiple non primitive parameters function memoization

replace x with:

- 0 for sonic-memoize
- 1 for fast-memoize
- 2 for memoizee
- 3 for nano-memoize

### Benchmark LRU memoization of function with single parameter

Tests:

- calling the memoized function 1000 times with cache misses (testing performance of "adding new function calls to cache and deleting least recently used function call")
- calling the memoized function 1000 times with cache hits (testing performance of "reading from cache")

run

- `npm run benchmark:lrus1 x` for single string parameter function memoization
- `npm run benchmark:lrus2 x` for single number parameter function memoization
- `npm run benchmark:lrus3 x` for single non primitive parameter function memoization

replace x with:

- 0 for sonic-memoize
- 1 for memoizerific
- 2 for memoizee
- 3 for moize
- 4 for micro-memoize

### Benchmark LRU memoization of function with multiple parameters

Tests:

- calling the memoized function 1000 times with cache misses (testing performance of "adding new function calls to cache and deleting least recently used function call")
- calling the memoized function 1000 times with cache hits (testing performance of "reading from cache")

run

- `npm run benchmark:lrum1 x` for multiple primitive parameters function memoization
- `npm run benchmark:lrum2 x` for multiple non primitive parameters function memoization

replace x with:

- 0 for sonic-memoize
- 1 for memoizerific
- 2 for memoizee
- 3 for moize
- 4 for micro-memoize

## Considerations for realistic benchmarking

To create realistic and reproducible benchmarking we took the following steps:

- Benchmarks for different scenarios and libraries should be independent of each other. That's why we run them separately each in their own runtime. Memory usage of one benchmark run in the same runtime can effect the results of the next benchmark run.
- In order to get results that reflect the performance of benchmarking libraries we memoized cheap functions (instead of expensive functions). Otherwise the benchmarking results would reflect on the time it takes to call the expensive functions which is irrelevant for us.
- In order to get in a realistic usage window, we fed the memoized functions with 1000 different sets of arguments each in the benchmark runs. This is roughly in the middle of only calling the memoized function with a handful of different argument sets and calling it with hundreds of thousands.
- We tested for functions with different primitive parameters and non primitive parameters, as well as functions with one parameter and functions with multiple parameters.
- We separated libraries into separate groups according to the following features that have an immediate performance impact:
  - whether they can memoize functions with multiple parameters out of the box without further configuration
  - whether they have an LRU caching strategy
- We randomized and persisted our test data, so we get enough entropy for realistic benchmarking and keep reproduciblity.

## Benchmark results

### Memoization of function with single parameter without LRU Cache size limit

#### Avg time (ps) for 1000 Function calls with cache hits (reading from cache)

| library        | 1 string parameter | 1 number parameter | non primitive parameter |
| -------------- | ------------------ | ------------------ | ----------------------- |
| sonic-memoize  | 12.9               | 4.6                | 6.3                     |
| nano-memoize   | 14.0               | 7.8                | 10.1                    |
| mem            | 14.6               | 8.3                | 9.9                     |
| lodash.memoize | 115.0              | 40.6               | 20.4                    |
| fast-memoize   | 279.4              | 17.5               | 366.3                   |
| memoizee       | 3206.1             | 389.3              | 194.4                   |

#### Avg time (ps) for 1000 Function calls with new arguments (save into cache)

| library        | 1 string parameter | 1 number parameter | non primitive parameter |
| -------------- | ------------------ | ------------------ | ----------------------- |
| sonic-memoize  | 38.6               | 24.1               | 27.8                    |
| nano-memoize   | 41.3               | 30.7               | 34.3                    |
| mem            | 64.3               | 57.1               | 58.9                    |
| lodash.memoize | 226.3              | 141.3              | 44.3                    |
| fast-memoize   | 343.2              | 136.1              | 435.9                   |
| memoizee       | 4979.9             | 781.2              | 400.7                   |

### Memoization of function with multiple parameters without LRU Cache size limit

#### Avg time (ps) for 1000 Function calls with cache hits (reading from cache)

| library       | primitive parameters | non primitive parameters |
| ------------- | -------------------- | ------------------------ |
| sonic-memoize | 40.6                 | 68.1                     |
| fast-memoize  | 582.0                | 956.8                    |
| memoizee      | 401.6                | 138.0                    |
| nano-memoize  | 2995.0               | 1621.0                   |

#### Avg time (ps) for 1000 Function calls with new arguments (save into cache)

| library       | primitive parameters | non primitive parameters |
| ------------- | -------------------- | ------------------------ |
| sonic-memoize | 114.1                | 99.7                     |
| fast-memoize  | 646.3                | 1021.8                   |
| memoizee      | 717.9                | 354.6                    |
| nano-memoize  | 1557.0               | 1638.5                   |

### Memoization of function with single parameter with LRU Cache size limit

#### Avg time (ps) for 1000 Function calls with cache hits (reading from cache)

| library       | 1 string parameter | 1 number parameter | non primitive parameter |
| ------------- | ------------------ | ------------------ | ----------------------- |
| sonic-memoize | 27.3               | 19.5               | 24.0                    |
| memoizerific  | 3259.2             | 1173.8             | 1382.0                  |
| memoizee      | 3725.8             | 698.7              | 499.3                   |
| moize         | 8416.6             | 2526.6             | 3091.4                  |
| micro-memoize | 8351.7             | 2489.2             | 3098.6                  |

#### Avg time (ps) for 1000 Function calls with cache misses (save into cache and delete lru)

| library       | 1 string parameter | 1 number parameter | non primitive parameter |
| ------------- | ------------------ | ------------------ | ----------------------- |
| sonic-memoize | 69.7               | 70.6               | 72.5                    |
| memoizerific  | 147.9              | 153.6              | 153.7                   |
| memoizee      | 10313.4            | 3422.3             | 2986.6                  |
| moize         | 13008.9            | 6622.6             | 7696.8                  |
| micro-memoize | 13026.5            | 6511.0             | 7545.4                  |

### Memoization of function with multiple parameters with LRU Cache size limit

#### Avg time (ps) for 1000 Function calls with cache hits (reading from cache)

| library       | primitive parameters | non primitive parameters |
| ------------- | -------------------- | ------------------------ |
| sonic-memoize | 81.2                 | 73.3                     |
| memoizerific  | 4792.5               | 502.3                    |
| memoizee      | 1057.8               | 456.1                    |
| moize         | 13035.8              | 3519.9                   |
| micro-memoize | 12919.0              | 3501.4                   |

#### Avg time (ps) for 1000 Function calls with cache misses (save into cache and delete lru)

| library       | primitive parameters | non primitive parameters |
| ------------- | -------------------- | ------------------------ |
| sonic-memoize | 245.3                | 257.6                    |
| memoizerific  | 484.4                | 1531.3                   |
| memoizee      | 5883.2               | 2104.6                   |
| moize         | 17964.7              | 7943.7                   |
| micro-memoize | 17955.5              | 7884.3                   |

## License

[MIT](./LICENSE)
