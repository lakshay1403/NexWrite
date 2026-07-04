const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

//----Registration-----
const register = asyncHandler(async( req, res ) => {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            res.status(400)
            throw new Error('Please all fields are required')
        }

        //Checking the email is taken or not
        const userExists = await User.findOne({email});
        if(userExists){
            res.status(400);
            throw new Error('user already exists')
        }
       // hashing the user password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

        //creating the user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        //Adding the date the trial ends
        newUser.trialExpires = new Date(
            new Date().getTime() + newUser.trialPeriod * 24 *60 * 60 * 1000
        );
        await newUser.save()
        res.json({
        status: true,
        message: 'Registration successfull',
        user:{
            username,email
        }
    });
});

//----Login---
const login = asyncHandler(async( req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(401)
        throw new Error('Invalid email or password');
    }

    const isMatched = await bcrypt.compare(password, user?.password);
    if(!isMatched){
        res.status(401);
        throw new Error('Invalid email or password');
    }
    //Generating the token (jwt)
    const token = jwt.sign({id: user?._id}, process.env.JWT_SECRET,{
        expiresIn: '3d'     //expires in 3 days
    });
    //set the token into cookie (http only)
    res.cookie("token", token, {
        httpOnly: true,
        secure:process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
    //sending the response
    res.json({
        status: "success",
        _id: user?._id,
        message: "Login success",
        username: user?.username,
        email: user?.email,
    });
});

//--Logout---
const logout = asyncHandler(async(req,res) => {
    res.cookie('token', '', {maxAge: 1});
    res.status(200).json({message: 'Logout success'});
});

//---User profile----
const userProfile = asyncHandler(async(req,res) => {
    const id = '6a4782615d6084e99b6b7b78'
    const user = await User.findById(id).select('-password');
    if(user){
        res.status(200).json({
            status: "success",
            user,
        });
    }else{
        res.status(404);
        throw new Error("user not found");
    }
})
module.exports = {
    register,
    login,
    logout,
    userProfile,
};