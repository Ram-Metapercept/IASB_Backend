const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, default: Date.now }
});

const TagSetB = mongoose.model('IASB_Set_B_Tags', tagSchema);

module.exports = TagSetB;