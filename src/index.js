const cluster = require("cluster");
const express = require("express");
const { connectQueue } = require("./taskQueue");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < 2; i++) {
    // Two replicas
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  app.use(express.json());

  app.post("/task", require("./worker"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectQueue(); // Connect to the task queue
  });
}
