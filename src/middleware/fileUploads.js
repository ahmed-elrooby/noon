import multer from "multer";
import AppError from "./../utils/AppError.js";

let option = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("only images are allowed", 400));
    }
  }
  return multer({ storage, fileFilter });
};
export const fileUpload = (fieldName, folderName) =>
  option(folderName).single(fieldName);

export const uploadMixOfFiles = (fieldName, folderName) =>
  option(folderName).fields(fieldName);
