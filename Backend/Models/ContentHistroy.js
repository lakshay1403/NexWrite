const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    prompt:{
        type: String,
        required: true,
    },  
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "General",
    },
}, {
    timestamps: true,
});

const history = mongoose.model('history', historySchema);

module.exports = history;