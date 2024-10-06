# Node.js User Task Queuing with Rate Limiting

This project implements a Node.js API that handles user tasks with rate limiting and a task queueing system. The API ensures that each user can only perform a limited number of tasks within specified time intervals (1 task per second and 20 tasks per minute). Requests exceeding these limits are queued for processing.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing the API](#testing-the-api)
- [Logging](#logging)
- [Assumptions and Edge Cases](#assumptions-and-edge-cases)
- [License](#license)

## Requirements
- Set up a Node.js API cluster with two replica sets.
- Implement rate limiting to enforce one task per second per user ID.
- Create a task queueing system to manage tasks for each user ID.
- Implement a task function that logs task completion along with user ID and timestamp.
- Store task completion logs in a log file.
- Ensure that the API is resilient to failures and edge cases.

## Installation

### Clone the Repository:
```bash
git clone <https://www.github.com/Abhayy1202/TaskQueue.git>
cd src
```
### Install Dependencies:
Make sure you have Node.js and npm installed, then run:

```bash
npm install
```

## Configuration
Edit the config.js file to set up your server, Redis, logging, and rate limiting configurations:

```javascript
const config = {
    server: {
        port: process.env.PORT || 3000,
        clusterCount: 2,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || null,
    },
    logging: {
        logFilePath: path.join(__dirname, '../logs/task.log'),
        logLevel: process.env.LOG_LEVEL || 'info',
    },
    rateLimiting: {
        tasksPerSecond: 1,
        tasksPerMinute: 20,
    },
};

module.exports = config;
```
## Running the Application
### Start Redis:
Make sure your Redis server is running.

### Run the Application:
Start your application using:
```bash
node src/index.js
```
### Cluster Setup:
The application will automatically create two replicas for handling requests.

## Testing the API
You can test the API using tools like Postman or curl.
### Example Request
Send a POST request to /task with the following JSON body:

```json
{
    "user_id": "123"
}
```
### Using curl:
```bash
curl -X POST http://localhost:3000/task -H "Content-Type: application/json" -d '{"user_id":"123"}'
```
### Expected Response
- If within rate limits, you should receive:

```json
{
    "message": "Task for user 123 is queued."
}
```

- If rate limits are exceeded, you will receive:
```json
{
    "message": "Rate limit exceeded, your request has been queued."
}
```

## Logging
Task completion logs are stored in logs/task.log. Each entry includes the user ID and timestamp when the task was completed.

## Assumptions and Edge Cases
- No Requests Dropped: All requests exceeding rate limits are preserved and processed later.
- Asynchronous Handling: The application handles asynchronous operations effectively to ensure reliability.
- Error Handling: Basic error handling is implemented; further enhancements may be added as needed.

## License
This project is licensed under the MIT License.