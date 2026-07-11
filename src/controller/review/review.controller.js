import { reviewModel } from "../../../databases/models/review.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import { ApiFeature } from "../../utils/ApiFeature.js";
import AppError from "../../utils/AppError.js";

const createreView = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  req.body.userId = req.user._id;
  const isReviewed = await reviewModel.findOne({
    userId: req.user._id,
    productId: req.body.productId,
  });
  if (isReviewed) {
    return next(new AppError("you already reviewed this product", 400));
  }
  const result = new reviewModel(req.body);
  await result.save();
  res.json({ message: "review created", result });
});
const getAllReviews = catchAsyncError(async (req, res, next) => {
  const results = new ApiFeature(reviewModel.find({}), req.query)
    .paginate()
    .filter()
    .sort()
    .selectedFields()
    .search();
  const result = await results.mongooseQuery;
  res.json({ message: "all reviews", page: results.page, result });
});
const getSingleReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await reviewModel.findById(id);
  !result && next(new AppError("review not found", 404));
  result && res.json(result);
});
const deleteReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await reviewModel.findByIdAndDelete(id);
  !result && next(new AppError("review not found", 404));
  result && res.json({ message: "review deleted", result });
});
const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const result = await reviewModel.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  !result && next(new AppError("review not found", 404));
  result && res.json({ message: "review updated", result });
});

export {
  createreView,
  getAllReviews,
  getSingleReview,
  deleteReview,
  updateReview,
};
