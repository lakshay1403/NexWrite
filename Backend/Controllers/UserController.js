const User = require('../Models/User');
const bcrypt = require('bcryptjs');

//----Registration-----
const register = async(req,res) => {
    try {
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
    } catch (error) {
        throw new Error(error);
    }
};


module.exports = register;