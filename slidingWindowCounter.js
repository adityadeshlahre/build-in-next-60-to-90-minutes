class System {
  constructor() {
    this.limit = 10;
    this.windowSize = 60000;
    this.windowStart = Date.now();
    this.currentWindowCount = 0;
    this.previousWindowCount = 0;
  }

  getCurrentCount() {
    const elapsed = Date.now() - this.windowStart;
    const windowsPassed = Math.floor(elapsed / this.windowSize);

    if (windowsPassed > 1) {
      this.previousWindowCount = 0;
      this.currentWindowCount = 0;
      this.windowStart = Date.now();
    }

    if (windowsPassed === 1) {
      this.previousWindowCount = this.currentWindowCount;
      this.currentWindowCount = 0;
      this.windowStart = Date.now();
    }

    const elapsedNow = Date.now() - this.windowStart;
    const fraction = (this.windowSize - elapsedNow) / this.windowSize;

    return this.previousWindowCount * fraction + this.currentWindowCount;
  }

  allow() {
    if (this.getCurrentCount() >= this.limit) {
      return false;
    }
    this.currentWindowCount++;
    return true;
  }
}
