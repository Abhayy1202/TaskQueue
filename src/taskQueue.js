const Queue = require("bull");
const taskQueue = new Queue("task_queue");

taskQueue.process(async (job) => {
  const { user_id } = job.data;
  await task(user_id);
});

async function task(user_id) {
  console.log(`${user_id}-task completed at-${Date.now()}`);
  logTaskCompletion(user_id); // Log completion to file
}

function logTaskCompletion(user_id) {
  const fs = require("fs");
  const path = require("path");

  const logMessage = `${user_id}-task completed at-${new Date().toISOString()}\n`;
  fs.appendFileSync(path.join(__dirname, "../logs/task.log"), logMessage);
}

function connectQueue() {
  taskQueue.on("completed", (job) => {
    console.log(`Job ${job.id} completed!`);
  });

  taskQueue.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed with error ${err.message}`);
  });
}

module.exports = { connectQueue };
