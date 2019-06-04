export class CachedStorage {
  constructor() {
    this.storage = {};
  }

  get(key) {
    return new Promise((res, rej) => res(this.storage[key] || null));
  }
}
