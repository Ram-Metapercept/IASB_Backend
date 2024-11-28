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

const TagSetC = mongoose.model('IASB_Set_C_Tags', tagSchema);
const AttrSetC = mongoose.model('IASB_Set_C_Attributes', attrSchema);

module.exports = { TagSetC, AttrSetC };
