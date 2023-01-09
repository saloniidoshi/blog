const mongoose = require('mongoose');


const BlogSchema = mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   category: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true,
   },
   description: {
      type: String,
      required: true,
   },
   image: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      required: true,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      allowNull: true,
      default: Date.now,
   },
   slug: {
      type: String,
      required: true,
      unique: true
   }
});





module.exports = mongoose.model('Blogs', BlogSchema)