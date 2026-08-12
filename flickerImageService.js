class User {
  constructor({ userId, subscriptionStatus, rateLimiterStatus }) {
    this.userId = userId;
    this.subscriptionStatus = subscriptionStatus;
    this.rateLimiterStatus = rateLimiterStatus;
  }
}

class Subscription {
  constructor() {
    this.limits = {
      normal: 10,
      premium: 100,
    };
  }

  getLimit(subscriptionStatus) {
    return this.limits[subscriptionStatus];
  }
}

class RateLimiter {
  // fixed window
  constructor() {
    this.windowStart = 60;
    this.requestCount = 10;
    this.queue = new Queue();
  }
}

class Queue {
  constructor() {
    this.queue = {
      normal: new Map(),
      premium: new Map(),
    }; // FIFO
  }
}

class DownloadService {
  download({ requestId }) {
    console.log(`Image Downloaded for Request ID: ${requestId}`);
  }
}
