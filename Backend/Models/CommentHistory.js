const mongoose = require('mongoose');

const historySchema = new mongoose.model({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const history = mongoose.model('history', historySchema);

module.exports = history;