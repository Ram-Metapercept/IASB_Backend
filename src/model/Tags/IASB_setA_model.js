const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, default: Date.now }
});

const TagSetA = mongoose.model('IASB_Set_A_Tags', tagSchema);

module.exports = TagSetA;
