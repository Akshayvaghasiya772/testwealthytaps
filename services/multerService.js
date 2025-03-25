const multer = require("multer");
const path = require("path");
const fs = require("fs");
const logger = require("./logger");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multerS3 = require("multer-s3");

const generateRandomFilename = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const filenameGenerator = (file) => {
  const extension = path.extname(file.originalname);
  return `${generateRandomFilename()}${extension}`;
};

// File size limits in bytes
const fileSizeLimits = {
  jpeg: 2 * 1024 * 1024, // 2 MB for JPEG
  jpg: 10 * 1024 * 1024, // 10 MB for JPG
  png: 2 * 1024 * 1024, // 2 MB for PNG
  mp4: 50 * 1024 * 1024, // 50 MB for MP4
  // gif: 1 * 1024 * 1024, // 1 MB for GIF
  // pdf: 5 * 1024 * 1024, // 5 MB for PDF
  // docx: 10 * 1024 * 1024, // 10 MB for DOCX
};

// Allowed file types regex
const allowedFileTypes = /jpeg|jpg|png|mp4/;

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase().slice(1); // Extract the extension without the dot
  const mimetype = file.mimetype.split("/")[1]; // Extract the file type from the MIME
  const maxSize = fileSizeLimits[extname]; // Get the max size for the current file extension
  if (!allowedFileTypes.test(extname) || !allowedFileTypes.test(mimetype)) {
    return cb(new Error("Invalid file type!"));
  }

  // If file size exceeds the limit, reject the file before uploading
  if (req.headers['content-length'] > maxSize) {
    return cb(new Error(`File size exceeds the limit of ${maxSize / (1024 * 1024)} MB for ${extname}`));
  }

  cb(null, true); // Accept the file if all checks pass
};

const uploadFile = ({ destination, keyName, req, uploadToS3 = false }) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.resolve(__basedir, "assets", destination);

      if (!fs.existsSync(uploadDir) && !uploadToS3) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      AWS.config.update({
        endpoint: process.env.S3ENDPOINT, //your storage-endpoint
        accessKeyId: process.env.S3ACCESSKEYID,         //your access-key
        secretAccessKey: process.env.S3SECRETACCESSKEY,    //your secret-key    
      });

      const storage = uploadToS3
        ? multerS3({
          s3: new AWS.S3({
            endpoint: process.env.S3ENDPOINT, //your storage-endpoint
            accessKeyId: process.env.S3ACCESSKEYID,         //your access-key
            secretAccessKey: process.env.S3SECRETACCESSKEY,    //your secret-key    
          }),
          bucket: process.env.S3PRIMARYBUCKET,
          acl: "public-read",
          contentType: multerS3.AUTO_CONTENT_TYPE,
          // "Content-Type": "multipart/form-data",
          serverSideEncryption: "AES256",
          cacheControl: "max-age=1800",
          metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
          },
          key: function (req, file, cb) {
            cb(null, destination + "/" + filenameGenerator(file));
          },
        })
        : multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, uploadDir);
          },
          filename: (req, file, cb) => {
            const filename = filenameGenerator(file);
            cb(null, filename);
          },
        });

      const upload = uploadToS3
        ? multer({
          storage,
          fileFilter // File filter checks file type and size
        }).array(keyName, 10)
        : multer({
          storage,
          fileFilter, // File filter checks file type and size
        }).single(keyName); // Only one file at a time

      upload(req, {}, (err) => {
        if (err) {
          logger.error("Upload error:", err.message);
          return reject(err);
        }
        if (!(req.file || req.files)) {
          const noFileError = new Error("No files uploaded");
          logger.error(noFileError.message);
          return reject(noFileError);
        }
        const result = req.files ?? [req.file];
        resolve(result);
      });
    } catch (error) {
      logger.error("Multer file upload service error: ", error);
      reject(error);
    }
  });
};

module.exports = { uploadFile, filenameGenerator };
