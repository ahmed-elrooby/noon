import express from "express";
import {
  addTowhishlist,
  getUserWishlist,
  removeFromwhishlist,
} from "../controller/wishlist/whishlist.controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../controller/auth/auth.controller.js";
const whishlistRouter = express.Router();
whishlistRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addTowhishlist);
whishlistRouter
  .route("/")
  .delete(protectedRoutes, allowedTo("user"), removeFromwhishlist);
whishlistRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), getUserWishlist);
export default whishlistRouter;
