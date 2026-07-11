import { subcategoryModel } from "../../../databases/models/subcategory.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import slugify from "slugify";
import AppError from "../../utils/AppError.js";
import { ApiFeature } from "../../utils/ApiFeature.js";

const createSubCategory = catchAsyncError(async (req, res) => {
  const { name, categoryId } = req.body;
  const result = new subcategoryModel({
    name,
    slug: slugify(name),
    categoryId,
  });
  await result.save();

  res.json({ message: "success" });
});
const getAllSubCategories = catchAsyncError(async (req, res) => {
  let apiFeature = new ApiFeature(subcategoryModel.find({}), req.query)
    .paginate()
    .filter()
    .sort()
    .selectedFields()
    .search();
  const result = await ApiFeature.mongooseQuery;
  res.json(result);
});

const getsingleSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await subcategoryModel.findById(id);
  !result && next(new AppError("subcategory not found", 404));
  result && res.json(result);
});
const updateSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await subcategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true },
  );
  !result && next(new AppError("subcategory not found", 404));
  result && res.json({ message: "subcategory updated", result });
});
const deleteSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await subcategoryModel.findByIdAndDelete(id);
  !result && next(new AppError("subcategory not found", 404));
  result && res.json({ message: "subcategory deleted" });
});

export {
  createSubCategory,
  getAllSubCategories,
  getsingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
