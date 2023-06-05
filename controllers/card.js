const Horoscope = require("../models/horoscope");
const HoroscopeCategory = require("../models/horoscopeCategory");
const Card = require("../models/card");
const { globalImageUploader } = require("../global/fileUploader");

exports.createCard = async (req, res) => {
  const { title, description, horoscope, horoscopeCategory } = req.body;
  try {
    let card = new Card({
      title,
      description,
    });
    await card.save();
    let cardData = await Card.findById(card._id);
    console.log(cardData);
    cardData.horoscope.push(horoscope);
    cardData.horoscopeCategory.push(horoscopeCategory);
    if (req.file || req.files) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(async (file) => {
          const image = await globalImageUploader(file, cardData._id, "card");
          cardData.images.push(image.Location);
        });
      } else {
        const image = await globalImageUploader(req.file, cardData._id, "card");
        cardData.images.push(image.Location);
      }
    }
    await cardData.save();
    return res.status(200).json({ message: "Card created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).populate([
      {
        path: "horoscope",
        model: "Horoscope",
      },
      {
        path: "horoscopeCategory",
        model: "HoroscopeCategory",
      },
    ]);
    return res.status(200).json({ card });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCard = async (req, res) => {
  const { title, description, horoscope, horoscopeCategory } = req.body;
  try {
    let card = await Card.findById(req.params.id);
    card.title = title;
    card.description = description;
    card.horoscope = horoscope;
    card.horoscopeCategory = horoscopeCategory;
    if (req.file || req.files) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(async (file) => {
          const image = await globalImageUploader(file, card._id, "card");
          card.images.push(image.Location);
        });
      } else {
        const image = await globalImageUploader(req.file, card._id, "card");
        card.images.push(image.Location);
      }
    }
    await card.save();
    return res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    let card = await Card.findById(req.params.id);
    card.isDeleted = true;
    card.deletedAt = Date.now();
    await card.save();
    return res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({ isDeleted: false }).populate([
      {
        path: "horoscope",
        model: "Horoscope",
      },
      {
        path: "horoscopeCategory",
        model: "HoroscopeCategory",
      },
    ]);
    return res.status(200).json({ cards });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.addImage = async (req, res) => {
  try {
    const id = req.params.id || req.body.card;
    let card = await Card.findById(id);
    console.log(card);
    var images = [];
    if (req.file || req.files) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(async (file) => {
          const image = await globalImageUploader(file, card._id, "card");
          images.push(image.Location);
          //   console.log(image)
         
          await Card.updateOne(
            {
              _id: id,
            },
            {
              $set: {
                $push: {
                  images: image.Location,
                },
              },
            },
            { new: true }
          );
        });
      } else {
        const image = await globalImageUploader(req.file, card._id, "card");
        console.log(image);
        images = [...images].push(image.Location);
      }
    }
    console.log(images);
    if (images.length > 0) {
      console.log("I am here");
      await Card.updateOne(
        { _id: id },
        {
          $set: {
            $push: {
              images: [...images],
            },
          },
        }
      );
    }
    return res.status(200).json({ message: "Image added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
