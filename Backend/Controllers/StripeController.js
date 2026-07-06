const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

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

module.exports = HandlePayment;