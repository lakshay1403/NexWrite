require('dotenv').config();

const express = require('express');
const userRouter = require('./route/UserRouter');
const connectDB = require('./utils/connectDB');
const errorHandler = require('./middlewares/errorMiddleware');
const app = express();
const cookieParser = require('cookie-parser');
const GeminiRouter = require('./route/GeminiAiRouter');
const stripeRouter = require('./route/stripeRouter');
const cron = require('node-cron');
const User = require('./Models/User');
const cors = require('cors');



connectDB();
const PORT = process.env.PORT || 3000


//Cron for the trial period: run every single day
cron.schedule('0 0 * * * *', async()=>{
    const today = new Date()
    try {
        const updatedUser = User.updateMany({
            trialActive: true,
            trialExpires: {$lt: today}
        },{
            trialActive: false,
            subscriptionPlan: 'Free',
            monthlyRequestCount: 5
        });
    } catch (error) {
        console.log(error);
    }
});
//Cron for the Free Plan: run at the end of every month
cron.schedule('0 0 1 * * *', async()=>{
    const today = new Date()
    try {
        User.updateMany({
            subscriptionPlan: 'Free',
            nextBillingDate: {$lt: today},
        },{
            monthlyRequestCount: 0,
        });
    } catch (error) {
        console.log(error);
    }
});
//Cron for the Basic Plan: run at the end of every month
cron.schedule('0 0 1 * * *', async()=>{
    const today = new Date()
    try {
        User.updateMany({
            subscriptionPlan: 'Basic',
            trialExpires: {$lt: today}
        },{
            monthlyRequestCount: 0,
        });
    } catch (error) {
        console.log(error);
    }
});
//Cron for the Premium Plan: run at the end of every month
cron.schedule('0 0 1 * * *', async()=>{
    const today = new Date()
    try {
        User.updateMany({
            subscriptionPlan: 'Premium',
            nextBillingDate: {$lt: today}
        },{
            monthlyRequestCount: 0,
        });
    } catch (error) {
        console.log(error);
    }
});
//Cron paid plan

//Middlewares
app.use(express.json());   //pass incoming json data
app.use(cookieParser());     // pass the cookie automatically
const corsOption = {
    origin: "http://localhost:3000",
    credentials: true,
};

app.use(cors(corsOption));

//Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/gemini', GeminiRouter);
app.use('/api/v1/stripe', stripeRouter);

//--Error handling middleware---
app.use(errorHandler);


//Starting the server
app.listen(PORT,()=>{
    console.log(`Server is up and running on PORT ${PORT}`)
});