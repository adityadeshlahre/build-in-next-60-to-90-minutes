class System {
  constructor() {
    this.limit = 5;
    this.windowSize = 60000;
    this.windowStart = Date.now();
    this.requestCount = 0;
  }

  getCurrentCount() {
    let elapsed = Date.now() - this.windowStart;

    if (elapsed >= this.windowSize) {
      this.requestCount = 0;
      this.windowStart = Date.now();
      return this.requestCount;
    }

    return this.requestCount;
  }

  allow() {
    if (
      this.getCurrentCount() >= this.limit ||
      this.requestCount === this.limit
    ) {
      return false;
    }
    this.requestCount++;
    return true;
  }
}
