/* eslint-disable no-unused-vars */
var mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    userName: String,
    password: String,
    name: String,
    email: String,
    avatar: String,
    phone: String,
    dateCreated: Date,
    email_active: Boolean,
    type: Number,
    status: Boolean,
})
module.exports = mongoose.model('Users', UserSchema)
