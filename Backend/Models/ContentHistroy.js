const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
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

const ContentHistory = mongoose.model('ContentHistory', HistorySchema);

module.exports = ContentHistory;