const { captureRejectionSymbol } = require("node:events");
const fs = require("node:fs");

const count = 30;

const numbers = Array.from({ length: count }, () => {
  return Math.floor(Math.random() * 99) + 1;
});

fs.writeFileSync("./input.txt", numbers.join("\n"));

if (fs.existsSync("./input.txt")) console.log("OK");

class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length();
  }

  peak() {
    return this.heap.length === 0 ? null : this.heap[0];
  }

  sinkDown(index) {
    let currentIndex = index;
    const lastIndex = this.heap.length - 1;

    while (true) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let swapIndex = null;

      if (leftChildIndex <= lastIndex) {
        if (this.heap[leftChildIndex] < this.heap[currentIndex]) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex <= lastIndex) {
        if (
          swapIndex === null &&
          this.heap[rightChildIndex] < this.heap[currentIndex]
        ) {
          swapIndex = rightChildIndex;
        } else if (
          // important
          swapIndex !== null &&
          this.heap[rightChildIndex] < this.heap[swapIndex]
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;
      this.swap(currentIndex, swapIndex);
      currentIndex = swapIndex;
    }
  }

  bubbleUp(index) {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);
      if (this.heap[currentIndex] < this.heap[parentIndex]) {
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  swap(i, j) {
    //indexes
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildValue(index) {
    return 2 * index + 1;
  }

  getRightChildValue() {
    return 2 * index + 2;
  }

  inset(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    // delete
    if (this.heap.length === 0) {
      return null;
    }
    if (this.heap.length === 1) {
      return this.heap.pop();
    }
    this.swap(0, this.heap.length - 1);
    const minValue = this.heap.pop();
    this.sinkDown(0);
    return minValue;
  }
}

const heap = new MinHeap();

class KWaySystem {
  constructor() {}
}
