var Token = require('../models/Token')
var jwt = require('jsonwebtoken')
const secretString = '*(79123jlhasdh012jdO*Y@*ODHljashdho9a28yd82ohd'

const isAdmin = function (req, res, next) {
    const token = findToken(req)
    if (!token) {
        res.json({ result: 0, message: 'Lack of parameters' })
    } else {
        findUser(req, function (user) {
            if (user.type != 1) {
                res.json({
                    result: 1,
                    message: 'you are not admin',
                })
            } else {
                next()
            }
        })
    }
}

const validUser = function (req, res, next) {
    const token = findToken(req)
    if (!token) {
        res.json({ result: 0, message: 'your need login' })
    } else {
        findUser(req, function (user) {
            if (!user) {
                res.json({
                    result: 0,
                    message: 'plz login again',
                })
            } else {
                next()
            }
        })
    }
}
const findToken = function (req) {
    let token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null
    return token
}

const findUser = async function (req, callbackUser) {
    const token = findToken(req)
    if (!token) {
        callbackUser(null)
    } else {
        let token2 = await Token.findOne({ token: token, status: true })
        if (token2 == null) {
            callbackUser(null)
        } else {
            jwt.verify(token, secretString, function (err, decoded) {
                if (err || decoded == undefined) {
                    callbackUser(null)
                } else {
                    callbackUser(decoded.data)
                }
            })
        }
    }
}

module.exports = {
    isAdmin,
    validUser,
    findToken,
    findUser,
}
