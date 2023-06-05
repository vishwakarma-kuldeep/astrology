const Card = require("../models/card");

exports.checkCardId = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.card;
    const checkCard = await Card.findById(id);
    if (!checkCard) {
      return res.status(400).json({ message: "Card does not exist" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
