const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    trailActive: {
        type: Boolean,
        default: true,
    },
    trailExpires: {
        type: Date,
    },
    subscription:{
        type: String,
        enum:['Trial','Free','Basic','Premium']
    },
    apiRequestCount:{
        type: Number,
        default: 0,
    },
    monthlyRequestCount: {
        type: Number,
        default: 0,
    },
    nextBillingDate: Date,
    payments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "payment",
        }
    ],
    History: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "history",
        }
    ]
},{
    timestamps: true,
 }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;