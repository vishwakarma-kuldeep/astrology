const Payment = require("../models/payment");
const User = require("../models/users");
const Product = require("../models/product");
const {paymentId} = require("../global/global");

exports.createPayment = async (req, res) => {
    let {productId,quantity,paymentType,status} = req.body;
    try {
        let product = await Product.findById(productId);
        let productPrice = product.price;
        let productQuantity = product.quantity;
        if(+productQuantity < +quantity){
            return res.status(400).json({ message: "Product quantity is less than the requested quantity" });
        }
        let payment = new Payment();
        payment.quantity = quantity;
        payment.amount = +productPrice * +quantity;
        payment.userId = req.user.userId;
        payment.productId = productId;
        payment.paymentType = paymentType;
        payment.paymentStatus = status||"pending";
        const pId =  await paymentId();
        payment.paymentId = pId;
        await payment.save();
        // update product quantity
        const newQuantity = productQuantity - quantity;
        console.log(newQuantity)
        product.quantity = newQuantity;
        await product.save();

        return res.status(200).json({ message: "Payment created successfully",pId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};