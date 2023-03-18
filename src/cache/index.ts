export default class LRUCache {
  private capacity: number;
  private cache: Map<any, any>;
  private prev: number[];
  private args: any[];
  private value: any[];
  private next: number[];
  private head: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.prev = new Array(capacity + 2);
    this.args = new Array(capacity + 2);
    this.value = new Array(capacity + 2);
    this.next = new Array(capacity + 2);
    this.head = capacity + 1;
    this.prev[this.head] = 0;
    this.next[0] = this.head;
  }

  public get(arg: any): any {
    if (this.cache.has(arg)) {
      const node = this.cache.get(arg);
      this.next[this.prev[node]] = this.next[node];
      this.prev[this.next[node]] = this.prev[node];
      this.next[this.prev[this.head]] = node;
      this.prev[node] = this.prev[this.head];
      this.next[node] = this.head;
      this.prev[this.head] = node;
      return this.value[node];
    }
  }

  public set(arg: any, value: any): void {
    let node: number = this.cache.get(arg);
    if (node !== undefined) {
      if (this.prev[this.head] !== node) {
        this.next[this.prev[node]] = this.next[node];
        this.prev[this.next[node]] = this.prev[node];
        this.next[this.prev[this.head]] = node;
        this.prev[node] = this.prev[this.head];
        this.next[node] = this.head;
        this.prev[this.head] = node;
      }
    } else {
      if (this.cache.size === this.capacity) {
        this.cache.delete(this.args[this.next[0]]);
        node = this.next[0];
        this.next[0] = this.next[node];
        this.prev[this.next[0]] = 0;
      } else {
        node = this.cache.size + 1;
      }
      this.prev[node] = this.prev[this.head];
      this.args[node] = arg;
      this.value[node] = value;
      this.next[node] = this.head;
      this.next[this.prev[this.head]] = node;
      this.prev[this.head] = node;
      this.cache.set(arg, node);
    }
  }
}
