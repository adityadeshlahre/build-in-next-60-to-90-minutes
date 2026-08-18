const timeStampsLogger = () => {
  console.log(`[${new Date().toLocaleString()}]`);
};

class System {
  constructor() {
    this.limit = 5;
    this.windowSize = 10000;
    this.requestStore = [];
  }

  queueTimeStamp(timeStamp) {
    this.requestStore.push(timeStamp);
  }

  dequeueTimeStamp() {
    return this.requestStore.shift();
  }

  allow() {
    const currentTimeStamp = Date.now();
    const windowBoundary = currentTimeStamp - this.windowSize;

    while (
      this.requestStore.length > 0 &&
      this.requestStore[0] <= windowBoundary
    ) {
      this.dequeueTimeStamp();
    }

    if (this.requestStore.length >= this.limit) {
      return false;
    }

    this.queueTimeStamp(currentTimeStamp);

    return true;
  }
}
