const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a name'],
    unique: [true, 'Tour name must be unique'],
  },
  duration: { type: Number, required: [true, 'A Tour must have a duration'] },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a group size'],
  },
  ratingAverage: { type: Number, default: 4.5 },
  ratingQuantity: { type: Number, default: 0 },
  priceDiscount: { type: Number },
  description: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a description'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a summary'],
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty'],
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a cover image'],
  },

  price: { type: Number, required: [true, 'A Tour must have a price'] },
  images: [String],
  createdAt: { type: Date, default: Date.now(), select: false },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
