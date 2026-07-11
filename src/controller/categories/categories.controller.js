import { categoryModel } from "../../../databases/models/category.mdoel.js";
import slugify from "slugify";
import AppError from "../../utils/AppError.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import { ApiFeature } from "../../utils/ApiFeature.js";

const createCategory = catchAsyncError(async (req, res) => {
  req.body.image = req.file.filename;
  req.body.slug = slugify(req.body.name);
  const result = new categoryModel(req.body);
  await result.save();
  res.json({ message: "category created", result });
});

const getAllCategories = catchAsyncError(async (req, res) => {
  let apiFeature = new ApiFeature(categoryModel.find({}), req.query)
    .paginate()
    .filter()
    .sort()
    .selectedFields()
    .search();
  const result = await apiFeature.mongooseQuery;
  res.json(result);
});
const getSingleCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await categoryModel.findById(id);
  !result && next(new AppError("category not found", 404));
  result && res.json(result);
});
const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await categoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true },
  );
  !result && next(new AppError("category not found", 404));
  result && res.json({ message: "category updated", result });
});
const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await categoryModel.findByIdAndDelete(id);
  !result && next(new AppError("category not found", 404));
  result && res.json({ message: "category deleted", result });
});
export {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
