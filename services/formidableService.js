const { formidable } = require("formidable");
const path = require("path");
const fs = require("fs");
const { fileUploadMessages } = require("../constants/messages");
const Product = require("../models/product");

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/avif",
];
const parseFormService = ({ req, docId, destination, isInventory = false }) => {
  try {
    return new Promise((resolve, reject) => {
      const form = formidable({ multiples: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return reject(new Error(`Error parsing form: ${err.message}`));
        }
        if (isInventory) {
          if (!fields.productId) {
            return reject(new Error("Product Id is required."));
          }
          const product = await Product.findById(fields.productId);
          if (!product) {
            return reject(new Error("Product not found."));
          }
        }
        const uploadedFiles = files.images
          ? Array.isArray(files.images)
            ? files.images
            : [files.images]
          : [];
        // const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images];
        const fileResponses = [];
        let count = 1;
        uploadedFiles.forEach((file) => {
          // if (file.size > 200 * 1024) {
          //     return reject({ message: fileUploadMessages.INVALID_FILE_SIZE(file.originalFilename) });
          // }
          // if (!file.mimetype.startsWith('image/')) {
          //     return reject({ message: fileUploadMessages.INVALID_FILE_TYPE(file.originalFilename) });
          // }

          if (!allowedImageTypes.includes(file.mimetype)) {
            return reject({
              message: fileUploadMessages.INVALID_FILE_SIZE(
                file.originalFilename
              ),
            });
          }

          const extension = path.extname(file.originalFilename);
          const newFilePath = path.join(
            destination,
            `${docId}_${count++}${extension}`
          );
          fs.copyFileSync(file.filepath, newFilePath);
          fileResponses.push({ fileName: file.name, filePath: newFilePath });
        });
        resolve({
          fields: fields,
          files: fileResponses,
        });
      });
    });
  } catch (error) {
    logger.error("Error - parseFormService: ", error);
    throw new Error(error.message ?? error);
  }
};

const parseFormDataService = ({ req }) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          fields: fields, // Any fields submitted
          files: files, // Files submitted
        });
      }
    });
  });
};

module.exports = {
  parseFormService,
  parseFormDataService,
};
