// 2) ROUTE HANDLERS

const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// if i add ? after the variable(id) it will be optional
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = async (req, res) => {
  const allUsers = await User.find();
  if (allUsers) {
    return res.status(200).json({
      status: 'success',
      results: allUsers.length,
      data: {
        users: allUsers,
      },
    });
  }

  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined yet!' });
};

exports.updateMe = async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined yet!' });
};
exports.createUser = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
};
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user) {
    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
};
