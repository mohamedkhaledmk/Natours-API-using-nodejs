const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkbodyMiddleware,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const authController = require('../controllers/authController');

// param middleware is a middleware that only runs when there is param found in the url for example here the (id)

const router = express.Router();

// param middleware:

// kol ely 3ndo parameter id e3mlo el function dy
// router.param('id', checkId);

// 3) ROUTES
router.route(`/top-5-cheap`).get(aliasTopTours, getAllTours);
router.route(`/tour-stats`).get(getTourStats);
router.route(`/monthly-plan/:year`).get(getMonthlyPlan);
router
  .route('/')
  .get(authController.protect, getAllTours)
  .post(checkbodyMiddleware, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
