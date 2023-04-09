var Post = require('../models/Post')
var Category = require('../models/Category')
var Token = require('../models/Token')

var jwt = require('jsonwebtoken')
const secretString = '*(79123jlhasdh012jdO*Y@*ODHljashdho9a28yd82ohd'

module.exports = function (app, config, middles) {
    app.post('/posts', middles.validUser, function (req, res) {
        if (
            !req.body.username ||
            !req.body.desc ||
            !req.body.price ||
            !req.body.area ||
            !req.body.phone ||
            !req.body.category
        ) {
            res.json({ result: 0, message: 'missing fields, plz' })
        } else {
            Category.findOne({ categoryName: req.body.category })
                .then(function (cat) {
                    if (cat != null) {
                        let post = new Post({
                            user: req.body.username,
                            desc: req.body.desc,
                            price: req.body.price,
                            area: req.body.area,
                            phone: req.body.phone,
                            category: req.body.category,
                        })
                        post.save()
                            .then(function (d) {
                                res.json({
                                    result: 1,
                                    message: 'succesfully post',
                                    data: d._id,
                                })
                            })
                            .catch((e) => {
                                res.json({ result: 0, message: `${e}` })
                            })
                    } else {
                        res.json({ result: 0, message: 'wrong Category' })
                    }
                })
                .catch((e) => {
                    res.json({ result: 0, message: `${e}` })
                })
        }
    })

    app.post('/category', middles.isAdmin, function (req, res) {
        if (!req.body.Category) {
            res.json({ result: 0, message: 'lack parameters' })
        } else {
            Category.findOne({ categoryName: req.body.Category })
                .then(function (cat) {
                    console.log(cat)
                    if (cat) {
                        res.json({ result: 0, message: 'lack parameters' })
                    } else {
                        let category = new Category({
                            categoryName: req.body.Category,
                        })
                        category
                            .save()
                            .then(function () {
                                res.json({ result: 1, message: 'successfully' })
                            })
                            .catch(() => {
                                res.json({
                                    result: 0,
                                    message: 'unknown error',
                                })
                            })
                    }
                })
                .catch(() => {
                    res.json({ result: 0, message: 'unknown error' })
                })
        }
    })

    let findPost = function (condition, res) {
        Post.find(condition)
            .then((list) => {
                res.json({
                    result: 1,
                    message: 'successfully owner ' + `${condition.user}`,
                    data: list,
                })
            })
            .catch(() => {
                res.json({ result: 0, message: 'unknow error' })
            })
    }

    app.get('/myposts', middles.validUser, function (req, res) {
        const token = req.headers.authorization
            ? req.headers.authorization.replace('Bearer ', '')
            : null
        if (!token) {
            res.json({ result: 0, message: 'plz login again' })
        } else {
            Token.findOne({ token: token, status: true })
                .then(function (token2) {
                    if (token2 == null) {
                        res.json({ result: 0, message: 'plz login again' })
                    } else {
                        jwt.verify(
                            token,
                            secretString,
                            function (err, decoded) {
                                if (err || decoded == undefined) {
                                    res.json({
                                        result: 0,
                                        message: 'plz login again',
                                    })
                                } else {
                                    findPost(
                                        { user: decoded.data.userName },
                                        res
                                    )
                                }
                            }
                        )
                    }
                })
                .catch(() => {
                    res.json({
                        result: 0,
                        message: 'unknow error, or require to login',
                    })
                })
        }
    })

    app.get('/posts', function (req, res) {
        findPost({}, res)
    })
}
