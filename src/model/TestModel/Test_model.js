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

const testTagModel = mongoose.model('Test_Tags', tagSchema);
const testAttrModel = mongoose.model('Test_Attrs', attrSchema);

module.exports = { testTagModel, testAttrModel };
