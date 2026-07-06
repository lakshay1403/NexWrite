const express = require('express');
const HandlePayment = require('../Controllers/StripeController');
const isAuthenticated = require('../middlewares/isAuthenticated');

const stripeRouter = express.Router();

stripeRouter.post('/checkout',isAuthenticated, HandlePayment);

module.exports = stripeRouter;