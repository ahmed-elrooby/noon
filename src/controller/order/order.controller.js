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
    },
  });
  res.json({ message: "success", session });
});
const createOnlineOrder = catchAsyncError((request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  // Get the signature sent by Stripe
  const signature = request.headers["stripe-signature"].toString();
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      "whsec_wyMe5oH9XB8eEbIEpUNbi4wbg85bEZ1T",
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return response.sendStatus(400);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
  } else {
    console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
export {
  createCashOrder,
  getMyOrders,
  getAllOrders,
  checkOutSession,
  createOnlineOrder,
};
