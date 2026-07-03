const express = require('express');
const register = require('../Controllers/UserController');

const userRouter = express.Router();

userRouter.post('/register', register);

module.exports = userRouter;