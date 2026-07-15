import catchAsyncError from "./../../middleware/catchAsyncError.js";
import { cartModel } from "./../../../databases/models/cart.model.js";
import AppError from "../../utils/AppError.js";
import { orderModel } from "../../../databases/models/order.model.js";
import { productModel } from "../../../databases/models/product.model.js";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    "STRIPE_SECRET_KEY is not set. Checkout routes will be unavailable.",
  );
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
/*
1- get cart by id 
2- calc totalOrderdPrice 
3-create order 
4 increase sold and decrease quantity
5-clear cart user 
*/
const createCashOrder = catchAsyncError(async (req, res, next) => {
  // get cart
  const cart = await cartModel.findById(req.params.id);
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }
  // calc totalOrderdPrice
  const totalOrderdPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  // create order
  const order = await new orderModel({
    userId: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderedPrice: totalOrderdPrice,
  });
  await order.save();
  // increase sold and decrease quantity
  if (order) {
    let options = cart.cartItems.map((ele) => ({
      updateOne: {
        filter: {
          _id: ele.productId,
        },
        update: {
          $inc: {
            quantity: -ele.quantity,
            sold: ele.quantity,
          },
        },
      },
    }));

    await productModel.bulkWrite(options);

    // clear cart user
    await cartModel.findByIdAndDelete(req.params.id);
  }

  res.json({ message: "order created successfully", order });
});
// get my orders
const getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find({ userId: req.user._id }).populate({
    path: "cartItems.productId",
    select: "title price imgCover",
  });
  res.json({ message: "success", orders });
});
const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find({}).populate({
    path: "cartItems.productId",
    select: "title price imgCover",
  });
  res.json({ message: "success", orders });
});
const checkOutSession = catchAsyncError(async (req, res, next) => {
  if (!stripe) {
    return next(new AppError("Stripe is not configured", 500));
  }

  const cart = await cartModel.findById(req.params.id);
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }
  const totalOrderdPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderdPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
    metadata: {
      cartId: cart._id.toString(),
      userId: req.user._id.toString(),
      street: req.body.shippingAddress.street,
      city: req.body.shippingAddress.city,
      phone: req.body.shippingAddress.phone,
    },
  });
  res.json({ message: "success", session });
});
const createOnlineOrder = catchAsyncError(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { cartId, userId, street, city, phone } = session.metadata;

    const cart = await cartModel.findById(cartId);

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    const totalOrderedPrice = cart.totalPriceAfterDiscount || cart.totalPrice;

    await orderModel.create({
      userId,
      cartItems: cart.cartItems,
      totalOrderedPrice,
      shippingAddress: {
        street,
        city,
        phone,
      },
      paymentMethod: "card",
      isPaid: true,
      paidAt: Date.now(),
    });

    const options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: item.quantity,
          },
        },
      },
    }));

    await productModel.bulkWrite(options);

    await cartModel.findByIdAndDelete(cartId);
  }

  res.status(200).json({
    received: true,
  });
});
export {
  createCashOrder,
  getMyOrders,
  getAllOrders,
  checkOutSession,
  createOnlineOrder,
};
