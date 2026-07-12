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

/**
 * @openapi
 * /address:
 *   patch:
 *     tags:
 *       - Address
 *     summary: Add a new address
 *     description: Add a new address for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alias
 *               - details
 *               - phone
 *               - city
 *             properties:
 *               alias:
 *                 type: string
 *                 example: Home
 *               details:
 *                 type: string
 *                 example: 15 Salah Salem Street
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *               city:
 *                 type: string
 *                 example: Cairo
 *     responses:
 *       200:
 *         description: Address added successfully.
 *       401:
 *         description: Unauthorized.
 *
 *   get:
 *     tags:
 *       - Address
 *     summary: Get user addresses
 *     description: Retrieve all addresses for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user addresses.
 *       401:
 *         description: Unauthorized.
 *
 *   delete:
 *     tags:
 *       - Address
 *     summary: Delete an address
 *     description: Remove an address from the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: string
 *                 example: 686c8d9d95a7cfd0f9f9f123
 *     responses:
 *       200:
 *         description: Address removed successfully.
 *       404:
 *         description: Address not found.
 *       401:
 *         description: Unauthorized.
 */
addressRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), createAddress)
  .get(protectedRoutes, allowedTo("user"), getUserAddresses)
  .delete(protectedRoutes, allowedTo("user"), removeAddress);

export default addressRouter;
