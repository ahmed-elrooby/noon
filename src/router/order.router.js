import express from "express";
import {
  allowedTo,
  protectedRoutes,
} from "../controller/auth/auth.controller.js";
import {
  checkOutSession,
  createCashOrder,
  getAllOrders,
  getMyOrders,
} from "../controller/order/order.controller.js";
const cashOrderRouter = express.Router();
cashOrderRouter.route("/").get(protectedRoutes, allowedTo("user"), getMyOrders);
cashOrderRouter.get("/all", protectedRoutes, allowedTo("admin"), getAllOrders);
cashOrderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), createCashOrder);
cashOrderRouter
  .route("/checkout/:id")
  .post(protectedRoutes, allowedTo("user"), checkOutSession);

export default cashOrderRouter;
