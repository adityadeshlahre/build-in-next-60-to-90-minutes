class System {
  constructor() {
    this.capacity = 5;
    this.queue = [];
    this.leakRate = 2000;

    setInterval(() => {
      if (this.queue.length > 0) {
        const request = this.queue.shift();
        console.log("Processing:", request);
      }
    }, this.leakRate);
  }

  allow(request) {
    if (this.queue.length >= this.capacity) {
      return false;
    }

    this.queue.push(request);
    return true;
  }
}
