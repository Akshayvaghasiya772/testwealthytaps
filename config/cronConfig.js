const cron = require("node-cron");
// const {
//   deleteLog,
//   deleteUnusedFiles,
//   processAllNotifications,
//   sendLikeNotificationsToPublishers,
// } = require("../services/cronService");

const scheduleCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    logger.info("Delete Log Cron Job Started");
    // await deleteLog();
    logger.info("Delete Log Cron Job Finished!!!");
  });

//   cron.schedule("0 1 * * *", async () => {
//     logger.info("Delete Unused Files Cron Job Started");
//     await deleteUnusedFiles();
//     logger.info("Delete Unused Files Cron Job Finished!!!");
//   });
};

module.exports = { scheduleCronJobs };
