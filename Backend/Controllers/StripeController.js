const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const calculateNextBillingDate = require('../utils/calculateNextBillingDate');
const shouldRenewSubscriptionPlan = require('../utils/shouldRenewSubscriptionPlan');
const Payment = require('../Models/Payment');
const User = require('../Models/User');

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
            paymentId: paymentIntent?.id,
            metadata: paymentIntent?.metadata,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error});
    }
});
//---Verifying the payment
const VerifyPayment = asyncHandler(async(req,res) => {
    const {paymentId} = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        if(paymentIntent.status !== 'succeeded'){
            const metadata = paymentIntent?.metadata;
            const subscriptionPlan = metadata?.subscriptionPlan;
            const userEmail = metadata?.userEmail;
            const userId = metadata?.userId;

            //finding the user
            const userFound = await User.findById(userId);
            if(!userFound){
                return res.status(404).json({
                    status: 'false',
                    message: "user not found",
                })
            }

            //getting the payment details
            const amount = paymentIntent?.amount / 100;
            const currency = paymentIntent?.currency;
            const paymentId = paymentIntent?.id;

            //creating the payment history
            const newPayment = await Payment.create({
                user: userId,
                email: userEmail,
                subscriptionPlan,
                amount,
                currency,
                status: "success",
                reference: paymentId,
            });

            //checking for the subscription plan

            if(subscriptionPlan === 'Basic'){
                //updating the user
                const updatedUser = await User.findByIdAndUpdate(userId, {
                    trialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 50,
                    subscriptionPlan: "Basic",
                    $addToSet: {payments: newPayment._id},
                });

                res.json({
                    status: true,
                    message: "Payment verified, user updated",
                    updatedUser,
                });
            }

            if(subscriptionPlan === 'Premium'){
                //updating the user
                const updatedUser = await User.findByIdAndUpdate(userId, {
                    trialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 100,
                    subscriptionPlan: 'Premium',
                    $addToSet: {payments: newPayment._id},
                });

                res.json({
                    status: true,
                    message: "Payment verified, user updated",
                    updatedUser,
                });
            }
            if(subscriptionPlan === 'Free'){
                //updating the user
                const updatedUser = await User.findByIdAndUpdate(userId, {
                    trialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 5,
                    subscriptionPlan: "Free",
                    $addToSet: {payments: newPayment._id},
                });

                res.json({
                    status: true,
                    message: "Payment verified, user updated",
                    updatedUser,
                });
            }
        };
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error,
        })
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


module.exports = {HandlePayment, handleFreeSubscription, VerifyPayment};