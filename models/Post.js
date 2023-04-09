/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    user: String,
    desc: String,
    area: String,
    price: Number,
    phone: String,
    category: String,
})
module.exports = mongoose.model('Posts', postSchema)
