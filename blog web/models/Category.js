const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({

    category: {
        type: String,
        required: true,
        unique: true,
        allowNull: false,

    },
});
module.exports = mongoose.model('Category', categorySchema);