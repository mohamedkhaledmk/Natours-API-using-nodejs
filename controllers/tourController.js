// const fs = require('fs');
const Tour = require('./../models/Tour');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const checkbodyMiddleware = (req, res, next) => {
  if (!req || !req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Error',
      message: 'The tour should contain name and price',
    });
  }
  next();
};
const checkId = catchAsync((req, res, next, val) => {
  console.log(`The id is : ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Not Found...',
      requestedAt: req.requestTime,
      message: 'Invalid ID',
    });
  }
  next();
});

const aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  // const allTours=await Tour.find().where('duration').equals(5).where('difficulty').equals(5) ---- 2adem khales w malosh lazma
  //  build query
  // 1- filtering query
  // const queryObj = { ...req.query };
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);
  // // // 2- advanced filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // console.log('ssss', queryStr);

  // let query = Tour.find(JSON.parse(queryStr));

  // // 2- sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }
  // //3-fields limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }
  // // 4- Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 1;
  // const skip = (page - 1) * limit;
  // query = query.skip(2).limit(10);

  // if (req.query.page) {
  //   const tourNums = await Tour.countDocuments();
  //   if (skip >= tourNums) throw new Error(`This page doesnot exist `);
  // }
  // //  execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const allTours = await features.query;
  res.status(200).json({
    status: 'success',
    results: allTours.length,
    data: { tours: allTours },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);
  //Tour.findOne({_id:id});
  if (!tour) {
    return next(new AppError(`Cannot find a Tour with that ID`, 404));
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: { tour },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   './dev-data/data/tours-simple.json',
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({ status: 'success', data: { tour: newTour } });
  //   }
  // );
  // momken nst3ml const newTour = Tour.create(req.body)

  const newTour = new Tour(req.body);
  await newTour.save();
  console.log(newTour);
  res.status(201).json({ status: 'success', data: { tour: newTour } });
});
const updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const newTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: { newTour },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    message: 'Tour successfully deleted❤️ ',
    data: null,
  });
});
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // difficulty: '$difficulty',
        numTours: { $sum: 1 }, //count Documents - add 1 for each doc
        numRatings: { $sum: 'ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //unwind will destructure the array and will output the Tour for each element of the array.
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
    // { $limit: 12 },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
module.exports = {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTour,
  checkId,
  checkbodyMiddleware,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
