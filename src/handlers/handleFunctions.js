import catchAsyncError from "../middleware/catchAsyncError.js";
import AppError from "../utils/AppError.js";
import slugify from "slugify";

const updateDocument = (model, key) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await model.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true },
    );
    !result && next(new AppError(`${key} not found`, 404));
    result && res.json({ message: `${key} updated`, result });
  });
};
const deleteDocument = (model, key) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const result = await brandModel.findByIdAndDelete(id);
    !result && next(new AppError(`${key} not found`, 404));
    result && res.json({ message: `${key} deleted` });
  };
};
export { updateDocument, deleteDocument };
