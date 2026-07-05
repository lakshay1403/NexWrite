const asyncHandler = require('express-async-handler');
const User = require('../Models/User');

const checkApiRequestLimit = asyncHandler(async(req, res , next) => {
    if(!req.user){
        return res.status(401).json({message: "Not Authorized"});
    }
    const user = await User.findById(req?.user?.id);
    if(!user){
        return res.status(404).json({ message: "User not found"});
    }
    let requestLimit = 0;
    if(user?.trialActive){
        requestLimit = user?.monthlyRequestCount;
    }
    //checking the user has exceeded it's monthly request
    if(user?.apiRequestCount >= requestLimit){
        throw new Error("API Request Limit reached, please Subscribe to a plan");
    }
    next();
});

module.exports = checkApiRequestLimit;