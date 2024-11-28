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

const TagSetA = mongoose.model('IASB_Set_A_Tags', tagSchema);
const AttrSetA = mongoose.model('IASB_Set_A_Attributes', attrSchema);

module.exports = { TagSetA, AttrSetA };
