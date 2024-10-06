const Redis = require("ioredis");
const redis = new Redis();

async function rateLimit(req, res, next) {
  const userId = req.body.user_id;

  const currentTime = Date.now();
  const oneSecondLimitKey = `${userId}:1s`;
  const oneMinuteLimitKey = `${userId}:1m`;

  // Check for 1 task per second
  const secondCount = await redis.incr(oneSecondLimitKey);
  if (secondCount === 1) {
    await redis.expire(oneSecondLimitKey, 1); // Set expiry to 1 second
  }

  if (secondCount > 1) {
    // Queue request if limit exceeded
    queueRequest(req);
    return res
      .status(429)
      .send("Rate limit exceeded, your request has been queued.");
  }

  // Check for 20 tasks per minute
  const minuteCount = await redis.incr(oneMinuteLimitKey);
  if (minuteCount === 1) {
    await redis.expire(oneMinuteLimitKey, 60); // Set expiry to 60 seconds
  }

  if (minuteCount > 20) {
    // Queue request if limit exceeded
    queueRequest(req);
    return res
      .status(429)
      .send("Rate limit exceeded, your request has been queued.");
  }

  next();
}

function queueRequest(req) {
  // Logic to send request to the task queue for processing later
}

module.exports = rateLimit;
