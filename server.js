import express from "express";
import dotenv from "dotenv";
import categoryRouter from "./src/router/category.router.js";
import DbConnect from "./databases/dbConnect.js";
import morgan from "morgan";
import AppError from "./src/utils/AppError.js";
import { glocalErrorHandler } from "./src/middleware/globalErrorMiddleware.js";
import subCategoryRouter from "./src/router/subCategory.router.js";
import brandRouter from "./src/router/brand.router.js";
import { productRouter } from "./src/router/product.router.js";
import userRouter from "./src/router/user.router.js";
import authRouter from "./src/router/auth.router.js";
import reviewRouter from "./src/router/review.router.js";
import { init } from "./src/index.routes.js";
import {
  allowedTo,
  protectedRoutes,
} from "./src/controller/auth/auth.controller.js";
import { applyCoupon } from "./src/controller/Cart/cart.controller.js";
const port = process.env.PORT || 3000;
const app = express();

dotenv.config();
console.log(dotenv.config());
console.log("Server Key:", process.env.STRIPE_SECRET_KEY);
app.use(express.json());
app.use("/", express.static("uploads/"));
app.set("query parser", "extended");
// app.use(morgan("dev"));
// categories
init(app);

DbConnect();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
process.on("unhandledRejection", (err) => console.log(err));
