// 2) ROUTE HANDLERS

// if i add ? after the variable(id) it will be optional
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

exports.getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not defined yet!' });
};
exports.getUser = (req, res) => {
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
