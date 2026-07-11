import AppError from "../../utils/AppError.js";
import {
  deleteDocument,
  updateDocument,
} from "../../handlers/handleFunctions.js";
import { ApiFeature } from "../../utils/ApiFeature.js";
import { userModel } from "../../../databases/models/user.model.js";

const createusers = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError("user already exist", 400));
  }
  const result = new userModel(req.body);
  await result.save();
  res.json({ message: "user created", result });
};

const getAllusers = async (req, res) => {
  let apiFeature = new ApiFeature(userModel.find({}), req.query)
    .paginate()
    .filter()
    .sort()
    .selectedFields()
    .search();
  const results = await apiFeature.mongooseQuery;
  res.json({ message: "success", page: apiFeature.page, results });
};
const getSingleusers = async (req, res, next) => {
  const { id } = req.params;
  const result = await userModel.findById(id);
  !result && next(new AppError("user not found", 404));
  result && res.json(result);
};
const deleteusers = async (req, res, next) => {
  const { id } = req.params;
  const result = await userModel.findByIdAndDelete(id);
  !result && next(new AppError("user not found", 404));
  result && res.json({ message: "user deleted successfully" });
};
const updateusers = async (req, res, next) => {
  const { id } = req.params;
  const result = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError("user not found", 404));
  result && res.json({ message: "user updated successfully", result });
};
const changePassword = async (req, res, next) => {
  const { id } = req.params;
  req.body.passwordChangedAt = Date.now();
  const result = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError("user not found", 404));
  result && res.json({ message: "user updated successfully", result });
};
export {
  createusers,
  getAllusers,
  getSingleusers,
  deleteusers,
  updateusers,
  changePassword,
};
