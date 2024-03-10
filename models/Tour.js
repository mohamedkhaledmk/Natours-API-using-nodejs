const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./User');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a name'],
      unique: [true, 'Tour name must be unique'],
      maxlength: [40, 'A Tour must have 40 or less characters'],
      minlength: [10, 'A Tour must have 10 or more characters'],
      // validate: [validator.isAlpha, 'Name should contain only characters'],
    },
    duration: { type: Number, required: [true, 'A Tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a group size'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      max: [1, 'A Tour must have rating equal or more than 1'],
      max: [5, 'A Tour must have rating equal or less than 5'],
    },
    ratingQuantity: { type: Number, default: 0 },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // thiis works only points to current doc on new doucment creation
          return val < this.price;
        },
        message:
          'The discount value ({VALUE}) can not exceed the original price of the tour',
      },
    },
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
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be :easy,medium or hard  ',
      },
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a cover image'],
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    price: { type: Number, required: [true, 'A Tour must have a price'] },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    startLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual properties: properties to add to our schema that won't be stored on the database to save space, bcs it is calculated from others

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//DOCUMENT MIDDLEWARE: runs before .save() command and .create() - but not insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

// QUERY MIDDLEWARE:runs before or after query ( find )
// tourSchema.pre(/^find/, function (next) {
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}ms`);
  // console.log('documents: ', docs);
  next();
});

// aggregation middleware:allows us to add hooks before or after an aggregation happens
tourSchema.pre(`aggregate`, function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // to add it to first of the array of the stages of the aggregate obj
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
