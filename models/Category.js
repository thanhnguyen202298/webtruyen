/* eslint-disable no-unused-vars */
var mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    categoryName: String,
})
module.exports = mongoose.model('Categories', categorySchema)
