require("dotenv").config();
const Order = require("../Models/Order");
const dotenv = require("dotenv")
dotenv.config()
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

const createOrder = async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;
    const sessions = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "try",
            product_data: {
              name: "Payment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    if (sessions.id) {
      const newOrder = new Order({
        user,
        items,
        totalAmount,
        sessionId: sessions.id,
      });
      const savedOrder = await newOrder.save();
      await Order.findByIdAndUpdate(savedOrder._id, {
        payment: true,
      });
      res.status(200).json({
        success: true,
        message: "Payment successfull",
        data: savedOrder,
        sessionId: sessions.id,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Payment failed",
      });
    }
  } catch (error) {
    console.log("🚀 ~ createOrder ~ error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const marderOrderAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    order.status = "Delivered";
    await order.save();
    res.status(200).json({
      success: true,
      data: order,
      message: "Order delivered successfully",
    });
  } catch (error) {
    console.log("🚀 ~ marderOrderAsDelivered ~ error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.food").populate("user");
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("🚀 ~ createOrder ~ error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getSingleOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const userOrders = await Order.find({ user: userId })
      .populate("items.food")
      .populate("user");
    res.status(200).json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    console.log("🚀 ~ getSingleOrder ~ error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  marderOrderAsDelivered,
};
