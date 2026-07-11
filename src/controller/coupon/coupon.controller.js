import qrcode from "qrcode";
import AppError from "../../utils/AppError.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import { copounModel } from "../../../databases/models/copoun.model.js";

const createCoupon = catchAsyncError(async (req, res, next) => {
  const result = new copounModel(req.body);
  await result.save();
  res.json({ message: "coupon created", result });
});
const getAllCoupons = catchAsyncError(async (req, res, next) => {
  // let qrcode = await qrcode.toDataURL(req.body.url);
  const result = await copounModel.find();
  res.json({ message: "all coupons", result });
});

const getSpecificCopoun = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const result = await copounModel.findById(id);
  let url = await qrcode.toDataURL(result.code);
  !result && next(new AppError("coupon not found", 404));
  result && res.json({ message: "specific coupon", result, url });
});

const deleteCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await copounModel.findByIdAndDelete(id);
  !result && next(new AppError("coupon not found", 404));
  result && res.json({ message: "coupon deleted", result });
});

const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await copounModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  !result && next(new AppError("coupon not found", 404));
  result && res.json({ message: "coupon updated", result });
});

export {
  createCoupon,
  getAllCoupons,
  getSpecificCopoun,
  deleteCoupon,
  updateCoupon,
};
