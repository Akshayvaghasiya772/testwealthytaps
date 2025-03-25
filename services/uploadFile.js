const Files = require("../model/file");
const { uploadFile } = require("./multerService");
const path = require("path");
const { FILE_DESTINATION } = require("../constants/systemConst");

const getFileByIdService = async (fileId) => {
  try {
    const file = await Files.findOne({ _id: fileId });
    if (!file) throw new Error("No file found!!!");
    return file;
  } catch (error) {
    logger.error("Error - getFileByIdService", error);
    throw new Error(error.message ?? error);
  }
};

const uploadMedia = async ({ req, uploadToS3 = false }) => {
  try {
    const { type } = req.params;
    const { userType, user } = req;
    const destination = FILE_DESTINATION[type];
    if (!destination) {
      throw new Error("Invalid params provided");
    }
    const keyName = "files";

    const uploadedFiles = await uploadFile({
      destination,
      keyName,
      req,
      uploadToS3,
    });
    if (uploadedFiles.length === 0) {
      throw new Error("No files uploaded");
    }
    const savedFiles = await Promise.all(
      uploadedFiles.map(async (fileObj) => {
        const filePath = uploadToS3 ? fileObj.location : fileObj?.path;
        const filename = path.basename(filePath);
        const nm = filename.split(".")[0];
        const exten = path.extname(filePath).substring(1);
        const uri = fileObj.location ?? "";
        const createdBy = {
          refType: userType == 1 ? "publisher" : "user",
          refId: user?._id,
        };
        const fileDetails = {
          nm,
          oriNm: fileObj.originalname,
          exten,
          uri,
          mimeType: fileObj.mimetype,
          size: null,
          folderNm: FILE_DESTINATION[type],
          createdBy,
        };
        return await Files.create(fileDetails);
      })
    );

    return {
      success: true,
      data: savedFiles,
    };
  } catch (error) {
    logger.error("Error - uploadMedia", error);
    throw new Error(error.message ?? error);
  }
};

module.exports = {
  uploadMedia,
  getFileByIdService,
};
