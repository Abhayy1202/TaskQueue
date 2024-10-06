const fs = require("fs");
const path = require("path");
const config = require("./config"); // Importing the configuration

function logTaskCompletion(user_id) {
  const logMessage = `${user_id} - task completed at ${new Date().toISOString()}\n`;
  fs.appendFileSync(config.logging.logFilePath, logMessage); // Use the path from config
}

module.exports = { logTaskCompletion };
