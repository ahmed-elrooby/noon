import {
  allowedTo,
  protectedRoutes,
} from "./controller/auth/auth.controller.js";
import { applyCoupon } from "./controller/Cart/cart.controller.js";
import { glocalErrorHandler } from "./middleware/globalErrorMiddleware.js";
import addressRouter from "./router/addresses.router.js";
import expressRouter from "./router/addresses.router.js";
import authRouter from "./router/auth.router.js";
import brandRouter from "./router/brand.router.js";
import cartRouter from "./router/cart.router.js";
import categoryRouter from "./router/category.router.js";
import couponRouter from "./router/coupon.router.js";
import cashOrderRouter from "./router/order.router.js";
import { productRouter } from "./router/product.router.js";
import reviewRouter from "./router/review.router.js";
import subCategoryRouter from "./router/subCategory.router.js";
import userRouter from "./router/user.router.js";
import whishlistRouter from "./router/whishlist.router.js";
import AppError from "./utils/AppError.js";

export function init(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/categories", categoryRouter);

  // subcategories
  app.use("/api/v1/subcategories", subCategoryRouter);
  // brand
  app.use("/api/v1/brands", brandRouter);
  // product
  app.use("/api/v1/products", productRouter);
  // users
  app.use("/api/v1/users", userRouter);
  // reviews
  app.use("/api/v1/reviews", reviewRouter);
  // wishlist
  app.use("/api/v1/wishlist", whishlistRouter);
  // addresses
  app.use("/api/v1/addresses", addressRouter);
  // coupon
  app.use("/api/v1/coupon", couponRouter);
  // cart
  app.use("/api/v1/carts", cartRouter);
  // apply copoun
  app.post(
    "/api/v1/applyCoupon",
    protectedRoutes,
    allowedTo("user"),
    applyCoupon,
  );
  // order
  app.use("/api/v1/orders", cashOrderRouter);
  app.all("/*splat", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  app.use(glocalErrorHandler);
}
