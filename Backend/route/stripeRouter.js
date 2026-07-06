const express = require('express');
const {HandlePayment, handleFreeSubscription} = require('../Controllers/StripeController');
const isAuthenticated = require('../middlewares/isAuthenticated');

const stripeRouter = express.Router();

stripeRouter.post('/checkout',isAuthenticated, HandlePayment);
stripeRouter.post('/free',isAuthenticated, handleFreeSubscription);

module.exports = stripeRouter;