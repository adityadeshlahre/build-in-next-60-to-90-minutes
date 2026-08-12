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
  constructor({ users, subscription, downloadService }) {
    this.users = users;
    this.subscription = subscription;
    this.downloadService = downloadService;
  }

  proccess(userId, requestId) {
    const user = this.users.get(userId);
    const limit = this.subscription.getLimit(user.subscriptionStatus);
    const state = user.rateLimiterStatus;

    if (Date.now() - state.windowStart >= 60000) {
      state.requestCount = 0;
      state.windowStart = Date.now();
      this.proccessQueue(userId);
    }

    if (state.requestCount < limit) {
      this.downloadService.download({ requestId });
      state.requestCount++;
    } else {
      state.queue.enqueue({ userId, requestId });
    }
  }

  proccessQueue(userId) {
    const user = this.users.get(userId);
    const limit = this.subscription.getLimit(user.subscriptionStatus);
    const state = user.rateLimiterStatus;

    while (state.queue.length > 0 && state.requestCount < limit) {
      const request = state.queue.dequeue();
      this.downloadService.download(request);
      state.requestCount++;
    }
  }
}

class System {
  constructor() {
    this.users = new Map();
    this.subscription = new Subscription();
    this.downloadService = new DownloadService();

    this.rateLimiter = new RateLimiter({
      users: this.users,
      subscription: this.subscription,
      downloadService: this.downloadService,
    });
  }

  createUser({ userId, subscriptionStatus }) {
    const user = new User({
      userId,
      subscriptionStatus,
      rateLimiterStatus: {
        windowStart: Date.now(),
        requestCount: 0,
        queue: new Queue(),
      },
    });

    this.users.set(userId, user);
  }
}

class Queue {
  constructor() {
    this.queue = [];
  }

  enqueue(request) {
    this.queue.push(request);
  }

  dequeue() {
    return this.queue.shift();
  }

  get length() {
    return this.queue.length;
  }
}

class DownloadService {
  download({ requestId }) {
    console.log(`Image Downloaded for Request ID: ${requestId}`);
  }
}
