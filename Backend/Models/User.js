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
    trialPeriod: {
        type: Number,
        default: 3,      //3 days
    },
    trialActive: {
        type: Boolean,
        default: true,
    },
    trialExpires: {
        type: Date,
    },
    subscriptionPlan:{
        type: String,
        enum:['Trial','Free','Basic','Premium']
    },
    apiRequestCount:{
        type: Number,
        default: 0,
    },
    monthlyRequestCount: {
        type: Number,
        default: 100,
    },
    nextBillingDate: Date,
    payments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
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
    toJSON:{ virtuals : true},
    toObject: { virtuals : true},
 }
);

//Adding a virtual property
UserSchema.virtual('isTrialActive').get(function(){
    return this.trialActive && new Date() < this.trialExpires;
});


const User = mongoose.model('User', UserSchema);

module.exports = User;