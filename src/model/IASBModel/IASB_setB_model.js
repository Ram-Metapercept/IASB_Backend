const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, default: Date.now }
});

const attrSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const TagSetB = mongoose.model('IASB_Set_B_Tags', tagSchema);
const AttrSetB = mongoose.model('IASB_Set_B_Attributes', attrSchema);

module.exports = { TagSetB, AttrSetB };
