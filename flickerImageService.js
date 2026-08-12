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


function assert(name, condition) {
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

async function runTests() {
  const system = new System();

  system.createUser({
    userId: "u1",
    subscriptionStatus: "normal",
  });

  const user = system.users.get("u1");

  // 10 requests → all should pass
  for (let i = 1; i <= 10; i++) {
    system.rateLimiter.proccess("u1", `req-${i}`);
  }

  assert(
    "Normal user processes 10 requests",
    user.rateLimiterStatus.requestCount === 10
  );

  assert(
    "Queue is empty after 10 requests",
    user.rateLimiterStatus.queue.length === 0
  );

  // 11th request → should be queued
  system.rateLimiter.proccess("u1", "req-11");

  assert(
    "11th request is queued",
    user.rateLimiterStatus.queue.length === 1
  );

  assert(
    "Request count remains 10",
    user.rateLimiterStatus.requestCount === 10
  );

  // Move user into the next window without waiting 60 seconds
  user.rateLimiterStatus.windowStart = Date.now() - 60001;

  // New request triggers window reset + queue processing
  system.rateLimiter.proccess("u1", "req-12");

  assert(
    "Queued request is processed in next window",
    user.rateLimiterStatus.queue.length === 0
  );

  assert(
    "New window processed queued + new request",
    user.rateLimiterStatus.requestCount === 2
  );

  // Premium test
  const premiumSystem = new System();

  premiumSystem.createUser({
    userId: "p1",
    subscriptionStatus: "premium",
  });

  const premiumUser = premiumSystem.users.get("p1");

  for (let i = 1; i <= 100; i++) {
    premiumSystem.rateLimiter.proccess("p1", `premium-${i}`);
  }

  assert(
    "Premium user processes 100 requests",
    premiumUser.rateLimiterStatus.requestCount === 100
  );

  premiumSystem.rateLimiter.proccess("p1", "premium-101");

  assert(
    "Premium 101st request is queued",
    premiumUser.rateLimiterStatus.queue.length === 1
  );
}

runTests();
