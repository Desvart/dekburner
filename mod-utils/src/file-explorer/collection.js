/**
 * Collection class
 * A collection of data for marker based templating
 */
export class Collection {
  #data;

  /**
   * Collection constructor
   */
  constructor() {
    this.#data = {};
  }

  /**
   * @return {{string: string|number}}
   */
  get single() {
    let single = {};
    for (let item in this.#data) {
      if (typeof this.#data[item] !== "object") {
        single[item] = this.#data[item];
      }
    }
    return single;
  }

  /**
   * @return {{string: string[]|number[]}}
   */
  get multi() {
    let multi = {};
    for (let item in this.#data) {
      if (typeof this.#data[item] === "object") {
        multi[item] = this.#data[item];
      }
    }
    return multi;
  }

  /**
   * Add a key-value pair to the data
   * Replaces existing key if it matches new key
   */
  add(key, value) {
    this.#data[key] = value;
  }
}