const rateLimit = require("./rateLimiter");
const { taskQueue } = require("./taskQueue");

async function createWorker(req, res) {
  await rateLimit(req, res, async () => {
    const user_id = req.body.user_id;

    // Send message to Bull queue here
    await taskQueue.add({ user_id });

    res.status(200).send(`Task for user ${user_id} is queued.`);
  });
}

module.exports = createWorker;
