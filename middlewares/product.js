const Product = require("../models/product");

exports.checkProduct = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.productId;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
