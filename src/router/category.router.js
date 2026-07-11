import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controller/categories/categories.controller.js";
import subCategoryRouter from "./subCategory.router.js";
import validate from "./../middleware/validate.js";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "../validation/category.validate.js";
import multer from "multer";
import AppError from "../utils/AppError.js";
import { fileUpload } from "../middleware/fileUploads.js";
const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);
categoryRouter
  .route("/")
  .get(getAllCategories)
  .post(
    fileUpload("image", "category"),
    validate(createCategorySchema),
    createCategory,
  );
categoryRouter
  .route("/:id")
  .get(validate(getCategorySchema), getSingleCategory)
  .delete(validate(getCategorySchema), deleteCategory)
  .put(
    fileUpload("image", "category"),
    validate(updateCategorySchema),
    updateCategory,
  );

export default categoryRouter;
