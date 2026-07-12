import express from "express";
import {
  allowedTo,
  protectedRoutes,
} from "../controller/auth/auth.controller.js";
import {
  createAddress,
  getUserAddresses,
  removeAddress,
} from "../controller/address/addresses.controller.js";

const addressRouter = express.Router();
addressRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), createAddress)
  .get(protectedRoutes, allowedTo("user"), getUserAddresses)
  .delete(protectedRoutes, allowedTo("user"), removeAddress);

export default addressRouter;
