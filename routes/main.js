/* eslint-disable no-unused-vars */
var User = require('../models/User')
var Token = require('../models/Token')
var Category = require('../models/Category')

var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const secretString = '*(79123jlhasdh012jdO*Y@*ODHljashdho9a28yd82ohd'

module.exports = function (app, config, middles) {
    app.post('/register', function (req, res) {
        if (!req.body.username || !req.body.pass || !req.body.email) {
            res.json({ result: 0, message: 'Lack of parameters' })
        } else if (!middles.validateEmail(req.body.email)) {
            res.json({ result: 0, message: 'Lack of Email' })
        } else {
            // check username/email
            var un = req.body.username.trim()
            var em = req.body.email.trim()
            var pw = req.body.pass
            let phone = req.body.phone
            let avatar = req.body.avatar || ''
            let name = req.body.name
            if (un.length <= 5 || em.length <= 5 || pw.length <= 5) {
                res.json({ result: 0, message: 'Wrong parameters' })
            } else {
                User.find({ $or: [{ username: un }, { email: em }] })
                    .then((users) => {
                        if (users.length > 0) {
                            res.json({
                                result: 0,
                                message: 'Username/email is not availble',
                            })
                        } else {
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(pw, salt, function (err, hash) {
                                    if (err) {
                                        res.json({
                                            result: 0,
                                            message: 'Hash password error',
                                        })
                                    } else {
                                        var newUser = new User({
                                            userName: un,
                                            password: hash,
                                            name,
                                            phone,
                                            email: em,
                                            email_active: false, // true da acitve, false chua active

                                            type: 0, //  0 Client, 1 Administrator

                                            status: 1, // 1 active, 0 block

                                            dateCreated: Date.now(),
                                            avatar,

                                            currentPoint: 0,
                                        })
                                        newUser
                                            .save()
                                            .then(function (_) {
                                                res.json({
                                                    result: 1,
                                                    message:
                                                        'User has been registered successfully.',
                                                })
                                            })
                                            .catch(function (_) {
                                                res.json({
                                                    result: 0,
                                                    message: 'Save user error',
                                                })
                                            })
                                    }
                                })
                            })
                        }
                    })
                    .catch((_) => {
                        res.json({
                            result: 0,
                            message: 'Username/email is not availble',
                        })
                    })
            }
        }
    })

    app.post('/login', function (req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({ result: 0, message: 'Lack of parameters' })
        } else {
            // check username/email
            var un = req.body.username.trim()
            var pw = req.body.password

            User.findOne({ userName: un })
                .then(function (user) {
                    if (user == null) {
                        res.json({
                            result: 0,
                            message: 'Username is not availble',
                        })
                    } else {
                        bcrypt.compare(pw, user.password, function (err, res2) {
                            if (err || res2 === false) {
                                res.json({
                                    result: 0,
                                    message: 'Wrong password',
                                })
                            } else {
                                user.password = '***'
                                jwt.sign(
                                    { data: user },
                                    secretString,
                                    { expiresIn: '72h' },
                                    function (err2, token) {
                                        if (err2) {
                                            res.json({
                                                result: 0,
                                                message: 'Token created error',
                                            })
                                        } else {
                                            var newToken = new Token({
                                                token,
                                                idUser: user._id,
                                                dateCreated: Date.now(),
                                                status: true,
                                            })
                                            newToken
                                                .save()
                                                .then(function (_) {
                                                    res.json({
                                                        result: 1,
                                                        message: token,
                                                        data: user,
                                                    })
                                                })
                                                .catch((_) => {
                                                    res.json({
                                                        result: 0,
                                                        message: 'Token error',
                                                    })
                                                })
                                        }
                                    }
                                )
                            }
                        })
                    }
                })
                .catch((_) => {
                    res.json({ result: 0, message: 'User info error' })
                })
        }
    })

    app.post('/logout', function (req, res) {
        const token = middles.findToken(req)
        if (!token) {
            res.json({ result: 0, message: 'Lack of parameters' })
        } else {
            Token.findOne({ token: token, status: true })
                .then(function (token) {
                    if (token == null) {
                        res.json({ result: 0, message: 'Token is not exist' })
                    } else {
                        Token.findOneAndUpdate(
                            { token: token },
                            { status: false, dateLogOut: Date.now() }
                        )
                            .then(function (e) {
                                res.json({
                                    result: 1,
                                    message: 'Logout successfully',
                                })
                            })
                            .catch((_) => {
                                res.json({
                                    result: 0,
                                    message: 'Loggout Error',
                                })
                            })
                    }
                })
                .catch((_) => {
                    res.json({ result: 0, message: 'Token is not exist' })
                })
        }
    })

    app.get('/admin', function (req, res) {
        res.render('Admin')
    })

    app.get('/login', function (req, res) {
        res.render('login')
    })

    app.get('/category', function (req, res) {
        Category.find({}, { _id: 0, categoryName: 1 })
            .then((data) => {
                res.json({
                    result: 1,
                    message: 'successfully',
                    data: data.map((d) => d.categoryName),
                })
            })
            .catch((e) => {
                console.log(e)
                res.json({ result: 0, message: `error ${e}` })
            })
    })
}
