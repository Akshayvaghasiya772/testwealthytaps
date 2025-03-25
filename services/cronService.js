// const mongoose = require("mongoose");
// const moment = require("moment-timezone");
// const fs = require("fs");
// const path = require("path");
// const { CUTOFF_DAYS } = require("../constants/cronConst");
// const { NOTI_SENDBY } = require("../constants/systemConst");

// // Schema for API Logs
// const apiLogSchema = new mongoose.Schema({}, { strict: false });
// const APILog = mongoose.model("APILog", apiLogSchema, "APILogs");

// // Backup paths
// const backupPaths = {
//   error: path.join(__dirname, "../backup/old_api_log"),
//   file: path.join(__dirname, "../backup/file"),
// };

// // Ensure backup folders exist
// Object.values(backupPaths).forEach((folder) => {
//   if (!fs.existsSync(folder)) {
//     fs.mkdirSync(folder, { recursive: true });
//   }
// });

// const deleteLog = async () => {
//   try {
//     const cutoffDate = moment()
//       .utc()
//       .subtract(CUTOFF_DAYS.DELETE_LOG, "days")
//       .toDate();

//     const logsToDelete = await APILog.find({ timestamp: { $lt: cutoffDate } });

//     if (logsToDelete.length > 0) {
//       for (const log of logsToDelete) {
//         // Extract creation date from timestamp
//         const creationDate = moment(log.timestamp).utc().format("YYYY-MM-DD");

//         // Construct file path for the date-wise JSON file
//         const backupFilePath = path.join(
//           backupPaths.error,
//           `${creationDate}.json`
//         );

//         // Load existing logs for the date if the file exists
//         let existingLogs = [];
//         if (fs.existsSync(backupFilePath)) {
//           existingLogs = JSON.parse(fs.readFileSync(backupFilePath, "utf-8"));
//         }

//         // Append the current log (cleaning `_id` for better readability)
//         const { ...cleanedLog } = log.toObject();
//         existingLogs.push(cleanedLog);

//         // Save updated logs to the file
//         fs.writeFileSync(backupFilePath, JSON.stringify(existingLogs, null, 2));
//       }

//       // Delete logs from DB
//       await APILog.deleteMany({ timestamp: { $lt: cutoffDate } });
//     }
//   } catch (error) {
//     logger.error("Error - deleteLog", error);
//     throw new Error(error.message ?? error);
//   }
// };

// const deleteUnusedFiles = async () => {
//   try {
//     const cutoffDate = moment()
//       .utc()
//       .subtract(CUTOFF_DAYS.DELETE_UNUSEDFILES, "days")
//       .toDate();
//     const unusedFiles = await Files.find({
//       isUsed: false,
//       createdAt: { $lt: cutoffDate },
//     });

//     const fileDetailsFolder = path.join(backupPaths.file, "fileDetails");

//     // Ensure base folders exist
//     [backupPaths.file, fileDetailsFolder].forEach((folder) => {
//       if (!fs.existsSync(folder)) {
//         fs.mkdirSync(folder, { recursive: true });
//       }
//     });

//     for (const file of unusedFiles) {
//       const folderName = file.folderNm?.trim() || "uncategorized";
//       const fileName = `${file.nm}.${file.exten}`;
//       const filePath = path.join(__dirname, "../assets", folderName, fileName);

//       // Create a subfolder inside the category folder using the file's `createdAt` date
//       const creationDate = moment(file.createdAt).utc().format("YYYY-MM-DD");
//       const dateFolderPath = path.join(
//         backupPaths.file,
//         folderName,
//         creationDate
//       );
//       const backupFilePath = path.join(dateFolderPath, fileName);

//       // Ensure category and date-specific folder exists
//       if (!fs.existsSync(dateFolderPath)) {
//         fs.mkdirSync(dateFolderPath, { recursive: true });
//       }

//       if (fs.existsSync(filePath)) {
//         fs.renameSync(filePath, backupFilePath);
//       }

//       // Create or update the fileDetails JSON file for this creation date
//       const fileDetailsPath = path.join(
//         fileDetailsFolder,
//         `${creationDate}.json`
//       );

//       let fileDetails = [];
//       if (fs.existsSync(fileDetailsPath)) {
//         fileDetails = JSON.parse(fs.readFileSync(fileDetailsPath, "utf-8"));
//       }

//       // Add new file detail (removing __v, size, and id)
//       const { __v, size, id, ...cleanedFile } = file.toObject();
//       fileDetails.push({
//         file: cleanedFile,
//       });

//       // Save updated file details
//       fs.writeFileSync(fileDetailsPath, JSON.stringify(fileDetails, null, 2));

//       // Delete the file entry from the database
//       await Files.deleteMany({ _id: file._id });
//     }
//   } catch (error) {
//     logger.error("Error - deleteUnusedFiles", error);
//     throw new Error(error.message ?? error);
//   }
// };

// // Function to check for publishers who haven't added a store
// const checkForStoreAddition = async () => {
//   try {
//     const twoDaysAgo = moment().subtract(2, 'days').toDate();

//     const startOfToday = moment().startOf('day').toDate(); // Start of today

//     const publishers = await Publisher.find({
//       isVerify: true,
//       createdAt: { $lte: twoDaysAgo },
//       storeRole: { $size: 0 },
//       $or: [
//         { lastStoreReminderSent: { $exists: false } }, // Never sent
//         { lastStoreReminderSent: { $lt: startOfToday } }, // Last sent before today

//       ],
//     }).lean();

//     const notificationTemplate = await RepeatedNotification.findOne({
//       type: "remindAddStore",
//     });

//     for (const publisher of publishers) {
//       const fcmTokens = (publisher.fcmTokens || []).map((token) => token.token);
//       if (fcmTokens.length > 0) {
//         const notificationData = {
//           title: notificationTemplate.title,
//           message: notificationTemplate.message,
//           targetAudiance: 1,
//           sendNow: true,
//           triggerOn: new Date(),
//           genBy: NOTI_SENDBY.system,
//         };

//         // Send notification
//         await sendNotificationService(notificationData, null);

//         // Update lastStoreReminderSent to current time
//         await Publisher.updateOne(
//           { _id: publisher._id },
//           { $set: { lastStoreReminderSent: new Date() } }
//         );
//       }
//     }
//   } catch (error) {
//     logger.error("Error checking for store addition: ", error);
//     throw new Error(error.message ?? error);
//   }
// };

// const checkForMissingContent = async () => {
//   try {
//     const threeDaysAgo = moment().subtract(3, 'days').toDate();
//     const twentyFourHoursAgo = moment().subtract(24, 'hours').toDate();
//     // Find stores created exactly 3 days ago with no content
//     const stores = await Store.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $lte: threeDaysAgo
//           },
//           deletedAt: { $exists: false },
//           $or: [
//             { noContentReminderSent: { $exists: false } },
//             { noContentReminderSent: { $lte: twentyFourHoursAgo } }
//           ]
//         }
//       },
//       {
//         $lookup: {
//           from: "ads",
//           localField: "_id",
//           foreignField: "storeId",
//           as: "ads"
//         }
//       },
//       {
//         $lookup: {
//           from: "coupon",
//           localField: "_id",
//           foreignField: "storeId",
//           as: "coupons"
//         }
//       },
//       {
//         $lookup: {
//           from: "tips",
//           localField: "_id",
//           foreignField: "storeId",
//           as: "tips"
//         }
//       },
//       {
//         $match: {
//           $and: [
//             { ads: { $size: 0 } },
//             { coupons: { $size: 0 } },
//             { tips: { $size: 0 } }
//           ]
//         }
//       }
//     ]);

//     const notificationTemplate = await RepeatedNotification.findOne({
//       type: "remindAddContent"
//     });

//     for (const store of stores) {
//       const publisher = await Publisher.findById(store.addedBy);
//       if (!publisher) continue;

//       const fcmTokens = (publisher.fcmTokens || []).map(t => t.token);
//       if (fcmTokens.length === 0) continue;

//       // Send notification
//       await sendNotificationService({
//         title: notificationTemplate.title,
//         message: notificationTemplate.message,
//         targetAudiance: 1,
//         fcmTokens: fcmTokens,
//         sendNow: true,
//         genBy: NOTI_SENDBY.system,
//       }, null);

//       // Mark notification as sent
//       await Store.updateOne(
//         { _id: store._id },
//         { $set: { noContentReminderSent: new Date() } }
//       );
//     }
//   } catch (error) {
//     console.error("Error in checkForMissingContent:", error);
//   }
// };

// const processAllNotifications = async () => {
//   try {

//     // Process repeated notifications
//     const nextHour = new Date(new Date().getTime() + 60 * 60 * 1000);

//     await fetchAndCreateNotificationFromScheduler({ nextHour });
//     await sendNotificationToDevicesNotLoggedIn();
//     await fetchAndSendRemainingNotification({ nextHour });
//     await checkForStoreAddition();
//     await checkForMissingContent();
//   } catch (error) {
//     logger.error("Error in processAllNotifications function:", error);
//     throw new Error(error.message ?? error);
//   }
// };

// const sendNotifications = async (tokens, type) => {
//   if (!tokens?.length) {
//     logger.info(`No tokens found for type: ${type}`);
//     return;
//   }

//   const notificationTemplate = await RepeatedNotification.findOne({ type });
//   if (!notificationTemplate) {
//     logger.error(`Notification template not found for type: ${type}`);
//     return;
//   }

//   return Promise.all(
//     tokens.map(async (tokenEntry) => {
//       const { token, deviceId } = tokenEntry;

//       try {
//         // Create notification data
//         const notificationData = {
//           title: notificationTemplate.title,
//           message: notificationTemplate.message,
//           img: notificationTemplate.img || null,
//           targetAudiance: notificationTemplate.targetAudiance,
//           sendNow: false,
//           triggerOn: new Date(),
//           genBy: NOTI_SENDBY.scheduler,
//         };

//         // Save notification to the Notification table
//         const newNotification = await Notification.create(notificationData);

//         // Prepare payload for push notification
//         // const notificationPayload = {
//         //   title: notificationTemplate.title,
//         //   body: notificationTemplate.message,
//         //   // imageUrl: notificationTemplate.imageUrl || "", // Uncomment if needed
//         // };

//         // Send push notification
//         // await sendPushNotification([token], notificationPayload);

//         // Update NotificationToken (e.g., decrement count and update lastSent)
//         await NotificationToken.updateOne(
//           { deviceId },
//           { $inc: { count: -1, timeSent: 1 }, lastSent: new Date() },
//           {}
//         );

//         // Mark notification as sent
//         // await Notification.findByIdAndUpdate(newNotification._id, { sent: true });

//         logger.info(`Notification sent to device ID ${deviceId} with type ${type}`);
//       } catch (error) {
//         logger.error(`Error sending notification to device ID ${deviceId}: ${error}`);
//       }
//     })
//   );
// };


// const sendLikeNotificationsToPublishers = async () => {
//   try {
//     const fourHoursAgo = moment().subtract(4, 'hours').toDate();
//     const now = new Date();
  
//     // Aggregate likes in the last 4 hours
//     const interactions = await Interaction.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: fourHoursAgo,  // Changed from $lte to $gte
//             $lte: now
//           },
//           isLiked: true,
//         }
//       },
//       {
//         $group: {
//           _id: "$adsId",
//           likeCount: { $sum: 1 }
//         }
//       },
//       {
//         $lookup: {
//           from: "ads",
//           localField: "_id",
//           foreignField: "_id",
//           as: "ad",
//           pipeline: [
//             {
//               $match: {
//                 deletedAt: { $exists: false }
//               }
//             },
//             {
//               $lookup: {
//                 from: "store",
//                 localField: "storeId",
//                 foreignField: "_id",
//                 as: "store",
//                 pipeline: [
//                   {
//                     $match: {
//                       deletedAt: { $exists: false },
//                       // inService: true
//                     }
//                   }
//                 ]
//               }
//             },
//             { $unwind: "$store" }
//           ]
//         }
//       },
//       { $unwind: "$ad" },
//       {
//         $group: {
//           _id: "$ad.store.addedBy",
//           totalLikes: { $sum: "$likeCount" },
//           adsCount: { $sum: 1 }
//         }
//       },
//       {
//         $match: {
//           totalLikes: { $gt: 0 }
//         }
//       }
//     ]);
//     const notificationTemplate = await RepeatedNotification.findOne({
//       type: "adsLikeNotification"
//     });

//     if (!notificationTemplate) {
//       console.error("Notification template not found for ads likes");
//       return;
//     }

//     for (const result of interactions) {
//       const publisher = await Publisher.findById(result._id)
//         .select("fcmTokens")
//         .lean();

//       if (!publisher || !publisher.fcmTokens?.length) continue;

//       // Customize message with actual counts
//       const message = notificationTemplate.message
//         .replace("{totalLikes}", result.totalLikes)
//         .replace("{adsCount}", result.adsCount);

//       await sendNotificationService({
//         title: notificationTemplate.title,
//         message: message,
//         fcmTokens: publisher.fcmTokens.map(t => t.token),
//         sendNow: true,
//         genBy: NOTI_SENDBY.system,
//       }, null);
//     }

//     console.log(`Sent ${interactions.length} like notifications successfully`);
//   } catch (error) {
//     console.error("Error in sendLikeNotificationsToPublishers:", error);
//   }
// };


// module.exports = { deleteLog, deleteUnusedFiles, processAllNotifications, sendLikeNotificationsToPublishers };
