import LRUCache from ".";
import OtherCache from "lru-cache";

test("returns correct values", () => {
  const cache = new LRUCache(500);

  for (let i = 0; i < 500; i++) {
    cache.set(i, i * 3);
  }

  for (let i = 0; i < 500; i++) {
    expect(cache.get(i)).toBe(i * 3);
  }
});

test("deletes values after capacity is reached", () => {
  const cache = new LRUCache(500);

  for (let i = 0; i < 600; i++) {
    cache.set(i, i * 3);
  }

  for (let i = 0; i < 600; i++) {
    expect(cache.get(i)).toBe(i < 100 ? undefined : i * 3);
  }
});

test("deletes values after capacity is reached when setting already filled keys", () => {
  const cache = new LRUCache(500);

  for (let i = 0; i < 600; i++) {
    cache.set(i, i * 3);
  }
  for (let i = 599; i >= 0; i--) {
    cache.set(i, i * 3);
  }

  for (let i = 0; i < 600; i++) {
    expect(cache.get(i)).toBe(i >= 500 ? undefined : i * 3);
  }
});

test("performance test", () => {
  const cache = new LRUCache(4990);
  const otherCache = new OtherCache({ max: 4990 });

  let t = performance.now();
  for (let k = 0; k < 100; k++) {
    for (let i = 0; i < 5000; i++) {
      cache.set(i, i * 3);
    }
    for (let i = -500; i < 5500; i++) {
      cache.get(i);
    }
  }
  console.log("LRU Cache: ", performance.now() - t);
  t = performance.now();
  for (let k = 0; k < 100; k++) {
    for (let i = 0; i < 5000; i++) {
      otherCache.set(i, i * 3);
    }
    for (let i = -500; i < 5500; i++) {
      otherCache.get(i);
    }
  }
  console.log("Other LRU Cache: ", performance.now() - t);
  t = performance.now();
  for (let k = 0; k < 100; k++) {
    for (let i = 0; i < 5000; i++) {
      cache.set(i, i * 3);
    }
    for (let i = -500; i < 5500; i++) {
      cache.get(i);
    }
  }
  console.log("LRU Cache: ", performance.now() - t);
});
