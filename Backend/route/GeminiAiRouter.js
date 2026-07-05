const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const generateContent = require('../Controllers/geminiController');
const GeminiRouter = express.Router();

GeminiRouter.post('/generate',isAuthenticated, generateContent);

module.exports = GeminiRouter;