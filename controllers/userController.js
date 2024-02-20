// 2) ROUTE HANDLERS

const User = require('../models/User');

// if i add ? after the variable(id) it will be optional
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

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
exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined yet!' });
};
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined yet!' });
};
exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined yet!' });
};
