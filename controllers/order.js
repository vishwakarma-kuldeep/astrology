const Order = require("../models/orders.js");
const User = require("../models/users.js");
const Product = require("../models/product.js");
const Payment = require("../models/payment.js");
const global = require("../global/global.js");
exports.createOrder = async (req, res) => {
  let { productId, paymentId } = req.body;
  try {
    let order = new Order();
    let product = await Product.findById(productId);
    let payment = await Payment.findOne({ paymentId: paymentId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    order.paymentId = payment._id;
    order.paymentGeneratedId = paymentId;
    order.userId = req.user.userId;
    order.orderId = await global.OrderId();
    await order.save();

    const OrderDetail = await Order.findById(order._id);
    return res
      .status(200)
      .json({ message: "Order created successfully", OrderDetail });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    let order = await Order.find({ userId: req.user.userId }).populate([
      {
        path: "userId",
        // select: 'firstName lastName mobileNumber email'
      },
      {
        path: "paymentId",
        // select: 'paymentId'
      },
    ]);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order found successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).populate([
      {
        path: "userId",
      },
      {
        path: "paymentId",
        populate: {
          path: "productId",
        },
       
      },
    ]);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order found successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
    try {
        const id = req.params.id;
        let order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.orderStatus = "Cancelled";
        await order.save();
        return res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
