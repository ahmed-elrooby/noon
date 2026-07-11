import { userModel } from "../../../databases/models/user.model.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const signUp = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new AppError("user already exist", 400));
  user = new userModel(req.body);
  await user.save();
  res.json({ message: "user created", user });
});
const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  let isFound = await userModel.find({ email: req.body.email });
  if (!isFound) return next(new AppError("user not found", 404));
  let match = await bcrypt.compare(password, isFound[0].password);
  if (match) {
    let token = jwt.sign({ id: isFound[0]._id }, process.env.SECRET_KEY);
    res.json({ message: "user signed in successfully", isFound, token });
  }
  next(new AppError("invalid password or email", 401));
});
const protectedRoutes = catchAsyncError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("token not found", 404));
  let decoded = await jwt.verify(token, process.env.SECRET_KEY);
  const user = await userModel.findById(decoded.id);
  if (!user) return next(new AppError("user not found", 404));
  req.user = user;

  next();
});
const allowedTo = (...roles) => {
  return catchAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you are not allowed to access this route", 403),
      );
    }

    return next();
  });
};
export { signUp, signIn, allowedTo, protectedRoutes };
