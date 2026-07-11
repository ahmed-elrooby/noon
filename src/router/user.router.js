import express from "express";
import {
  changePassword,
  createusers,
  deleteusers,
  getAllusers,
  getSingleusers,
  updateusers,
} from "../controller/users/users.controller.js";
const userRouter = express.Router();
userRouter.route("/").post(createusers).get(getAllusers);
userRouter
  .route("/:id")
  .get(getSingleusers)
  .delete(deleteusers)
  .put(updateusers);
userRouter.patch("/changePassword/:id", changePassword);
export default userRouter;
