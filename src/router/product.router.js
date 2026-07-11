import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controller/product/product.controller.js";
import { uploadMixOfFiles } from "../middleware/fileUploads.js";
import {
  allowedTo,
  protectedRoutes,
} from "../controller/auth/auth.controller.js";
const productRouter = express.Router();
let fileds = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
];
productRouter
  .route("/")
  .get(getAllProducts)
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadMixOfFiles(fileds, "products"),
    createProduct,
  );
productRouter
  .route("/:id")
  .get(getSingleProduct)
  .delete(deleteProduct)
  .put(updateProduct);
export { productRouter };
