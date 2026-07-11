import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getSpecificCopoun,
  updateCoupon,
} from "../controller/coupon/coupon.controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../controller/auth/auth.controller.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(protectedRoutes, allowedTo("admin"), createCoupon)
  .get(protectedRoutes, allowedTo("admin", "user"), getAllCoupons);

couponRouter
  .route("/:id")
  .get(protectedRoutes, allowedTo("admin", "user"), getSpecificCopoun)
  .delete(protectedRoutes, allowedTo("admin"), deleteCoupon)
  .put(protectedRoutes, allowedTo("admin"), updateCoupon);
export default couponRouter;
