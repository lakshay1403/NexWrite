const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const calculateNextBillingDate = require('../utils/calculateNextBillingDate');
const shouldRenewSubscriptionPlan = require('../utils/shouldRenewSubscriptionPlan');
const Payment = require('../Models/Payment');

const HandlePayment = asyncHandler(async(req,res) => {
    const { amount, subscriptionPlan } = req.body;
    //get the user
    const user = req?.user;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: 'usd',
            metadata:{
                userId: user._id?.toString(),
                userEmail: user?.email,
                subscriptionPlan,
            },
        });
        res.json({
            clientSecret: paymentIntent?.client_secret,
            paymentId: paymentIntent?.metadata,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error});
    }
});


//---Handle free Subscription
const handleFreeSubscription = asyncHandler(async( req , res) => {
    const user = req?.user;
    try {
        if(shouldRenewSubscriptionPlan(user)){
            user.subscriptionPlan = 'Free';
            user.monthlyRequestCount = 5;
            user.apiRequestCount = 0;
            user.nextBillingDate = calculateNextBillingDate();

             const newPayment = await Payment.create({
                user: user?._id,
                subscriptionPlan: 'Free',
                amount: 0,
                currency: 'usd',
                status: "Success",
                reference: Math.random().toString(36).substring(7),
            });

            user.payments.push(newPayment?._id);
            
            await user.save();

            res.json({
                status: "success",
                message: "Subscription plan updated successfully",
            });
        }
    } catch (error) {
        console.error(error);

        return res.json({
            message: error.message,
            stack: error.stack
        });
    }
});
module.exports = {HandlePayment, handleFreeSubscription};