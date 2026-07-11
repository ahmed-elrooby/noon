import { productModel } from "../../../databases/models/product.model.js";
import slugify from "slugify";
import { ApiFeature } from "../../utils/ApiFeature.js";
import AppError from "../../utils/AppError.js";

const createProduct = async (req, res, next) => {
  console.log(req.files);
  req.body.slug = slugify(req.body.title);
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.images = req.files.images.map((ele) => ele.filename);
  const result = new productModel(req.body);
  await result.save();
  res.json({ message: "product created successfully", result });
};

const getAllProducts = async (req, res) => {
  let apiFeature = new ApiFeature(productModel.find({}), req.query)
    .paginate()
    .filter()
    .sort()
    .selectedFields()
    .search();
  const result = await apiFeature.mongooseQuery;
  res.json({ message: "success", page: apiFeature.page, result });
};

const getSingleProduct = async (req, res, next) => {
  const { id } = req.params;
  const result = await productModel.findById(id);
  !result && next(new AppError("product not found", 404));
  result && res.json(result);
};
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const result = await productModel.findByIdAndDelete(id);
  !result && next(new AppError("product not found", 404));
  result && res.json({ message: "product deleted successfully" });
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const all = { ...req.body, slug: slugify(req.body.title) };
  const result = await productModel.findByIdAndUpdate(id, all, {
    new: true,
  });
  !result && next(new AppError("product not found", 404));
  result && res.json({ message: "product updated successfully", result });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
};
