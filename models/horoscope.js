const mongoose = require("mongoose");

const horoscopeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: [
      {
        type: String,
      },
    ],
    horoscopeType: {
      type: String,
      trim: true,
      enum:["monthly","yearly","daily","weekly","MONTHLY","YEARLY","DAILY","WEEKLY"]
    },
    date: {
      type: String,
      trim: true,
    },
    time: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Horoscope", horoscopeSchema);
