import express from "express";
import * as BrandController from "../controller/brand/brand.controller.js";
import validate from "./../middleware/validate.js";
import {
  createBrandSchema,
  getSingleBrandSchema,
  updateBrandSchema,
} from "../validation/brand.validation.js";
import { fileUpload } from "../middleware/fileUploads.js";

const brandRouter = express.Router();
brandRouter
  .route("/")
  .post(
    fileUpload("logo", "brands"),
    validate(createBrandSchema),
    BrandController.createBrand,
  )
  .get(BrandController.getAllBrands);
brandRouter
  .route("/:id")
  .get(validate(getSingleBrandSchema), BrandController.getSingleBrand)
  .delete(validate(getSingleBrandSchema), BrandController.deleteBrand)
  .put(validate(updateBrandSchema), BrandController.updateBrand);

export default brandRouter;
