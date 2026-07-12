import { brandModel } from "../../../databases/models/brand.model.js";
import slugify from "slugify";
import AppError from "../../utils/AppError.js";
import {
  deleteDocument,
  updateDocument,
} from "../../handlers/handleFunctions.js";
import { ApiFeature } from "../../utils/ApiFeature.js";

const createBrand = async (req, res) => {
  req.body.logo = req.file?.secure_url || req.file?.url || req.file?.filename;
  req.body.slug = slugify(req.body.name);
  const result = new brandModel(req.body);
  await result.save();
  res.json({ message: "brand created", result });
};

const getAllBrands = async (req, res) => {
  let apiFeature = new ApiFeature(brandModel.find({}), req.query)
    .paginate()
    .filter()
    .sort()
    .selectedFields()
    .search();
  const results = await apiFeature.mongooseQuery;
  res.json({ message: "success", page: apiFeature.page, results });
};
const getSingleBrand = async (req, res, next) => {
  const { id } = req.params;
  const result = await brandModel.findById(id);
  !result && next(new AppError("brand not found", 404));
  result && res.json(result);
};
const deleteBrand = deleteDocument(brandModel, "brand");
const updateBrand = updateDocument(brandModel, "brand");

export { createBrand, getAllBrands, getSingleBrand, deleteBrand, updateBrand };
