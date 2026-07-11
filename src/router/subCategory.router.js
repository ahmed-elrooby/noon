import express from "express";
import * as subcategoryController from "../controller/subcategories/subCategory.controller.js";
import validate from "./../middleware/validate.js";
import {
  createSubCategorySchema,
  getSingleSubCategorySchema,
  updateSubCategorySchema,
} from "../validation/subCategory.validation.js";
const subCategoryRouter = express.Router({ mergeParams: true });
subCategoryRouter
  .route("/")
  .post(
    validate(createSubCategorySchema),
    subcategoryController.createSubCategory,
  )
  .get(subcategoryController.getAllSubCategories);

subCategoryRouter
  .route("/:id")
  .get(
    validate(getSingleSubCategorySchema),
    subcategoryController.getsingleSubCategory,
  )
  .put(
    validate(updateSubCategorySchema),
    subcategoryController.updateSubCategory,
  )
  .delete(
    validate(getSingleSubCategorySchema),
    subcategoryController.deleteSubCategory,
  );
export default subCategoryRouter;
