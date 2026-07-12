import multer from "multer";
import AppError from "./../utils/AppError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("only images are allowed", 400));
  }
};

const upload = multer({ storage, fileFilter });

const uploadFilesToCloudinary = async (req, folder) => {
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, folder);
    req.file = {
      ...req.file,
      ...result,
      secure_url: result.secure_url,
      url: result.secure_url,
      filename: result.public_id,
    };
  }

  if (req.files) {
    const uploadedFiles = {};

    for (const [fieldName, files] of Object.entries(req.files)) {
      uploadedFiles[fieldName] = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file.buffer, folder);
        uploadedFiles[fieldName].push({
          ...file,
          ...result,
          secure_url: result.secure_url,
          url: result.secure_url,
          filename: result.public_id,
        });
      }
    }

    req.files = uploadedFiles;
  }
};

const createCloudinaryUploader = (handler, folder) => {
  return (req, res, next) => {
    handler(req, res, async (error) => {
      if (error) return next(error);

      try {
        await uploadFilesToCloudinary(req, folder);
        next();
      } catch (err) {
        next(err);
      }
    });
  };
};

export const fileUpload = (fieldName, folder) =>
  createCloudinaryUploader(upload.single(fieldName), folder);

export const uploadMixOfFiles = (fieldName, folder) =>
  createCloudinaryUploader(upload.fields(fieldName), folder);
