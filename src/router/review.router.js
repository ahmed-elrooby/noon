import express from "express";
import {
  createreView,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from "../controller/review/review.controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../controller/auth/auth.controller.js";
const reviewRouter = express.Router();
reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(protectedRoutes, allowedTo("user"), createreView);
reviewRouter
  .route("/:id")
  .get(getSingleReview)
  .delete(protectedRoutes, allowedTo("user", "admin"), deleteReview)
  .put(protectedRoutes, allowedTo("user"), updateReview);
export default reviewRouter;
