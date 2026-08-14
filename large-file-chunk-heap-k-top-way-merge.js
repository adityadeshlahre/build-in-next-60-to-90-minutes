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
    return this.heap.length;
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
        if (this.heap[leftChildIndex].value < this.heap[currentIndex].value) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex <= lastIndex) {
        if (
          swapIndex === null &&
          this.heap[rightChildIndex].value < this.heap[currentIndex].value
        ) {
          swapIndex = rightChildIndex;
        } else if (
          // important
          swapIndex !== null &&
          this.heap[rightChildIndex].value < this.heap[swapIndex].value
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
      if (this.heap[currentIndex].value < this.heap[parentIndex].value) {
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

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
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
  createChunk() {
    let fileCount = 0;

    const numbers = fs
      .readFileSync("./input.txt", { encoding: "utf8" })
      .split("\n")
      .map(Number);

    for (let i = 0; i < numbers.length; i += 5) {
      const chunk = numbers.slice(i, i + 5).sort((a, b) => a - b);
      console.log(chunk);
      fs.writeFileSync(`./chunk-${fileCount}.txt`, chunk.join("\n"));
      fileCount++;
    }
  }

  initializeHeap() {
    let listOfChunks = fs
      .readdirSync("./")
      .filter((file) => {
        return file.startsWith("chunk");
      })
      .map((file) => {
        return `./${file}`;
      });

    for (const fileName of listOfChunks) {
      let readFirstNumberFromInsideTheFiles = fs
        .readFileSync(fileName, { encoding: "utf8" })
        .split("\n")
        .map(Number)[0];

      heap.inset({
        value: readFirstNumberFromInsideTheFiles,
        chunk: fileName,
        position: 0,
      });
    }
  }

  merge() {
    const outputFile = "./output.txt";
    if (!fs.existsSync(outputFile)) {
      fs.writeFileSync(outputFile, "");
    }

    while (heap.size() > 0) {
      const current = heap.extractMin();

      fs.appendFileSync(outputFile, `${current.value}\n`);

      const values = fs
        .readFileSync(current.chunk, "utf8")
        .split("\n")
        .map(Number);

      const nextPosition = current.position + 1;

      if (nextPosition < values.length) {
        heap.inset({
          value: values[nextPosition],
          chunk: current.chunk,
          position: nextPosition,
        });
      }
    }
  }
}

const system = new KWaySystem();

system.createChunk();
system.initializeHeap();
system.merge();
