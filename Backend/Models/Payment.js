const mongoose  = require('mongoose');

const PaymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reference: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        required: true,
    },
    subscriptionPlan: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    monthlyRequestCount: {
        type: Number,
    },
},{
    timestamps: true,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;