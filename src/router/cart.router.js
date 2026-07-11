import express from "express";
import {
  allowedTo,
  protectedRoutes,
} from "../controller/auth/auth.controller.js";
import {
  addProductToCart,
  getLoggedUserCart,
  removeItemFromCart,
  updateQuantity,
} from "../controller/Cart/cart.controller.js";
const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), addProductToCart)
  .get(protectedRoutes, allowedTo("user"), getLoggedUserCart);

cartRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user"), removeItemFromCart)
  .put(protectedRoutes, allowedTo("user"), updateQuantity);
export default cartRouter;
