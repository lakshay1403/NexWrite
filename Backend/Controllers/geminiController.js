const { GoogleGenAI } = require('@google/genai');
const asyncHandler = require('express-async-handler');
const User = require('../Models/User');
const History = require('../Models/ContentHistroy');

console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateContent = asyncHandler(async(req,res)=> {
    try{
        const { prompt, type } = req.body;

    if(!prompt){
        return res.status(400).json({
            success: false,
            message: "Prompt is required",
        });
    }

    const user = req.user;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const generatedContent = response.text;

    const history = await History.create({
        user: user._id,
        prompt,
        content: generatedContent,
        type: type || "General",
    });

    await User.findByIdAndUpdate(user._id, {
        $push: {
            ContentHistory: history._id,
        },
        $inc: {
            apiRequestCount: 1,
        },
    });

    res.status(200).json({
        success: true,
        message: response.text,
    });
    } catch(error){
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = generateContent;