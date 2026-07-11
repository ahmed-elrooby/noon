import { userModel } from "../../../databases/models/user.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const createAddress = catchAsyncError(async (req, res, next) => {
  const result = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );
  !result && next(new AppError("user not found", 404));
  result &&
    res.json({
      message: "address added successfully",
      result: result.addresses,
    });
});
const getUserAddresses = catchAsyncError(async (req, res, next) => {
  const result = await userModel.findOne({ _id: req.user._id });
  !result && next(new AppError("user not found", 404));
  result && res.json({ message: "user addresses", result: result.addresses });
});
const removeAddress = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const result = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.body.address } },
    },
    { new: true },
  );
  !result && next(new AppError("user not found", 404));
  result &&
    res.json({
      message: "address removed successfully",
      result: result.addresses,
    });
});

export { createAddress, getUserAddresses, removeAddress };
