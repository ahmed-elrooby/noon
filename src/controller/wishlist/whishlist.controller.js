import { userModel } from "../../../databases/models/user.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import AppError from "../../utils/AppError.js";

const addTowhishlist = catchAsyncError(async (req, res) => {
  const result = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true },
  );
  !result && next(new AppError("user not found", 404));
  result &&
    res.json({
      message: "product added to wishlist successfully",
      result: result.wishList,
    });
});
const removeFromwhishlist = catchAsyncError(async (req, res) => {
  const result = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.body.productId },
    },
    { new: true },
  );
  !result && next(new AppError("user not found", 404));
  result &&
    res.json({
      message: "product removed from wishlist successfully",
      result: result.wishList,
    });
});
const getUserWishlist = catchAsyncError(async (req, res) => {
  const result = await userModel
    .findOne({ _id: req.user._id })
    .populate("wishList");
  !result && next(new AppError("user not found", 404));
  result && res.json({ message: "user wishlist", result: result.wishList });
});
export { addTowhishlist, removeFromwhishlist, getUserWishlist };
