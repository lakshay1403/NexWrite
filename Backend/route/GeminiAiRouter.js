const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const generateContent = require('../Controllers/geminiController');
const checkApiRequestLimit = require('../middlewares/checkApiRequestLimit');
const GeminiRouter = express.Router();

GeminiRouter.post('/generate',isAuthenticated,checkApiRequestLimit, generateContent);

module.exports = GeminiRouter;