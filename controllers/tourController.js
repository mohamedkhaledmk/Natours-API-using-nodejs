const fs = require('fs');
const Tour = require('./../models/Tour');
const { query } = require('express');

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
const checkId = (req, res, next, val) => {
  console.log(`The id is : ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Not Found...',
      requestedAt: req.requestTime,
      message: 'Invalid ID',
    });
  }
  next();
};


class APIFeatures (query,queryString){}

const aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  // const allTours=await Tour.find().where('duration').equals(5).where('difficulty').equals(5)
  //  build query
  // 1- filtering query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);
  // // 2- advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log('ssss', queryStr);

  let query = Tour.find(JSON.parse(queryStr));

  // 3- sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  //3-fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }
  // 4- Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 1;
  const skip = (page - 1) * limit;
  query = query.skip(2).limit(10);

  if (req.query.page) {
    const tourNums = await Tour.countDocuments();
    if (skip >= tourNums) throw new Error(`This page doesnot exist `);
  }
  // //  execute query
  const features = new APIFeatures(Tour.find(),req.query)
  const allTours = await query;
  res.status(200).json({
    status: 'success',
    results: allTours.length,
    data: { tours: allTours },
  });
};

const getTour = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id);
    //Tour.findOne({_id:id});

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { tour },
    });
  } catch (err) {
    res
      .status(404)
      .json({ status: 'Not found', message: 'No tour for found for thid ID' });
  }
};

const createTour = async (req, res) => {
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
  try {
    // momken nst3ml const newTour = Tour.create(req.body)

    const newTour = new Tour(req.body);
    await newTour.save();
    console.log(newTour);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'failed', message: ` Invalid data sent! ${err}` });
  }
};
const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const newTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { newTour },
    });
  } catch (err) {
    res
      .status(404)
      .json({ status: 'Not found', message: 'No tour for found for thid ID' });
  }
};

const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Tour successfully deleted❤️ ',
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: 'failure', message: 'Tour not found' });
  }
};

module.exports = {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTour,
  checkId,
  checkbodyMiddleware,
  aliasTopTours,
};
