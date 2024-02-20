const exp = require('constants');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/AppError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

//1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
//this middleware will be executed eachtime there is a new req. ---- if i removed the next(), it will not proceed to the following middleware function in the middleware stack and it will die in this middleware func
app.use((req, res, next) => {
  console.log('Hello from my middleware 👋');
  req.requestTime = new Date().toISOString(); //to add the req time to the req body
  next();
});

//if it is added those middlewares after the CRUD operations, it will not be executed because they end the request-response cycle

// app.get('/', (req, res) => {
//   res.status(200).send(`Hello From the server side!`);
// });

// app.post('/', (req, res) => {
//   res
//     .status(400)
//     .json({ message: 'Cannot POST to this endpoint', app: 'Natours' });
// });
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handle all requests that are not handled by the previous middlewares
app.all('*', (req, res, next) =>
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find (${req.originalUrl}) url on this server!`,
  // })
  {
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.statusCode = 404;
    // err.status = 'fail';

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  }
);

app.use(globalErrorHandler);

module.exports = app;
