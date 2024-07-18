const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, default: Date.now }
});

const TagSetC = mongoose.model('IASB_Set_C_Tag', tagSchema);

module.exports = TagSetC;