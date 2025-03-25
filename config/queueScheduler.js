const { Queue } = require('bullmq');
const redisConfig = require('./redis');

const notificationQueue = new Queue('notificationQueue', {
  connection: redisConfig,
});

module.exports = notificationQueue;
