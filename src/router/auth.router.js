import express from "express";
import { signIn, signUp } from "../controller/auth/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);

export default authRouter;
