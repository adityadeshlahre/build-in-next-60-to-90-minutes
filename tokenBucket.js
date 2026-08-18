class System {
  constructor() {
    this.capacity = 5;
    this.token = 0;
    this.refillRate = 2000;
    this.lastTimeSomethingHappened = Date.now();
  }

  allow() {
    const elapsed = Date.now() - this.lastTimeSomethingHappened;
    let newToken = elapsed / this.refillRate;
    let latestTotalToken = Math.min(this.token + newToken, this.capacity);
    this.token = latestTotalToken;
    this.lastTimeSomethingHappened = Date.now();

    if (this.token >= 1) {
      this.token--;
      return true;
    }
    return false;
  }
}
