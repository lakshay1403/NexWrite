const express = require('express');
const {HandlePayment, handleFreeSubscription, VerifyPayment} = require('../Controllers/StripeController');
const isAuthenticated = require('../middlewares/isAuthenticated');

const stripeRouter = express.Router();

stripeRouter.post('/checkout',isAuthenticated, HandlePayment);
stripeRouter.post('/free',isAuthenticated, handleFreeSubscription);
stripeRouter.post('/verify/:paymentId', isAuthenticated,  VerifyPayment);

module.exports = stripeRouter;