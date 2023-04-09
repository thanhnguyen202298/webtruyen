const mongoose = require('mongoose')
const storySchema = new mongoose.Schema({
    username: String,
    image: String,
    title: String,
    desc: String,
    dateCreated: Date,
    isFull: Boolean,
    author: String,
    price: Number,
    cate: String,
})
module.exports = mongoose.model('Stories', storySchema)
