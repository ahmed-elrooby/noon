import { cartModel } from "../../../databases/models/cart.model.js";
import { copounModel } from "../../../databases/models/copoun.model.js";
import { productModel } from "../../../databases/models/product.model.js";
import AppError from "../../utils/AppError.js";
import catchAsyncError from "./../../middleware/catchAsyncError.js";
function calculateTotalPrice(cart) {
  let totalprice = 0;
  cart.cartItems.forEach((ele) => {
    totalprice += ele.price * ele.quantity;
  });
  cart.totalPrice = totalprice;
}
const addProductToCart = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.body.productId);
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  req.body.price = product.price;

  const isExist = await cartModel.findOne({ userId: req.user._id });
  console.log(isExist);
  if (!isExist) {
    const result = new cartModel({
      userId: req.user._id,
      cartItems: [req.body],
    });
    calculateTotalPrice(result);
    await result.save();
    return res.json({ message: "success", result });
  }
  //   increase quqntity
  let item = isExist.cartItems.find(
    (ele) => ele.productId == req.body.productId,
  );
  if (item) {
    item.quantity += 1;
  } else {
    isExist.cartItems.push(req.body);
  }
  calculateTotalPrice(isExist);
  isExist.save();
  return res.json({ message: "success", cart: isExist });
});
const removeItemFromCart = catchAsyncError(async (req, res, next) => {
  let result = await cartModel.findOneAndUpdate(
    { userId: req.user.id },
    {
      $pull: { cartItems: { productId: req.params.id } },
    },
  );
  res.json({ message: "success", result });
});
const updateQuantity = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  let isCartExist = await cartModel.findOne({ userId: req.user._id });
  if (!isCartExist) {
    return next(new AppError("cart not found", 404));
  }
  let item = isCartExist.cartItems.find(
    (ele) => ele.productId == req.params.id,
  );
  if (!item) {
    return next(new AppError("item not found", 404));
  }
  item.quantity = req.body.quantity;
  calculateTotalPrice(isCartExist);
  isCartExist.save();
  res.json({ message: "success", cart: isCartExist });
});

/*
search if has coupon 
search if has cart
calc total price after discount
save total price after discount
return cart and total price 
*/
const applyCoupon = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  let coupon = await copounModel.findOne({ code: req.body.code });
  if (!coupon) {
    return next(new AppError("coupon not found", 404));
  }
  let cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }
  let totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  res.status(200).json({ message: "success", cart });
});
// get loged user cart
/*
search if has cart
return cart
*/
const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findOne({ userId: req.user._id }).populate({
    path: "cartItems.productId",
    select: "title price imgCover",
  });
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }
  res.status(200).json({ message: "success", cart });
});
export {
  addProductToCart,
  removeItemFromCart,
  updateQuantity,
  getLoggedUserCart,
  applyCoupon,
};
