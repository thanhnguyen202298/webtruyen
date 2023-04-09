/* eslint-disable no-unused-vars */
var Story = require('../models/story')
var StoryContent = require('../models/storyContent')
var Category = require('../models/Category')

var queryString = require('querystring')
var { Constant } = require('../middlewares/Constant')

module.exports = function (app, config, middles) {
    app.get('/story', function (req, res) {
        var page = req.query.page - 1 || 0
        var pageSize = req.query.page_size || Constant.PAGE_SIZE
        Story.find()
            .skip(page * pageSize)
            .limit(pageSize)
            .then((data) => {
                res.json({
                    result: 1,
                    message: 'successfully',
                    data,
                })
            })
            .catch((e) => {
                console.log(e)
                res.json({ result: 0, message: `error ${e}` })
            })
    })

    app.get('/myStory', middles.validUser, function (req, res) {
        var page = req.query.page - 1 || 0
        var pageSize = req.query.page_size || Constant.PAGE_SIZE

        middles.findUser(req, async function (user) {
            if (user) {
                Story.find({
                    $or: [
                        { username: user.userName },
                        { author: user.userName },
                    ],
                })
                    .skip(page * pageSize)
                    .limit(pageSize)
                    .then((data) => {
                        res.json({
                            result: 1,
                            message: 'successfully',
                            data,
                        })
                    })
                    .catch((e) => {
                        console.log(e)
                        res.json({ result: 0, message: `error ${e}` })
                    })
            } else {
                res.json({ result: 0, message: 'wrong user' })
            }
        })
    })

    app.get('/story/:cat', function (req, res) {
        let page = req.query.page - 1 || 0
        let pageSize = req.query.page_size || Constant.PAGE_SIZE
        var cat = req.params.cat
        cat = cat.replace('_', ' ')

        Story.find({ cate: cat })
            .skip(page * pageSize)
            .limit(pageSize)
            .then((data) => {
                res.json({
                    result: 1,
                    message: 'successfully',
                    data,
                })
            })
            .catch((e) => {
                console.log(e)
                res.json({ result: 0, message: `error ${e}` })
            })
    })

    app.post('/story', middles.validUser, async function (req, res) {
        var { image, title, desc, isFull, author, price, cate } = req.body

        if (!image || !title || !desc || !price || !cate) {
            res.json({ result: 0, message: 'missing fields, plz' })
        } else {
            middles.findUser(req, async function (user) {
                if (user) {
                    if (cate.toLowerCase().includes('option')) {
                        cate = cate.substring(
                            cate.indexOf('"') + 1,
                            cate.length - 2
                        )
                    }
                    let cat = await Category.findOne({
                        categoryName: cate.replace('_', ' '),
                    })
                    if (cat != null) {
                        let post = new Story({
                            username: user.userName,
                            image,
                            title,
                            desc,
                            dateCreated: Date.now(),
                            isFull: isFull || false,
                            author,
                            price,
                            cate: cat.categoryName,
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
                } else {
                    res.json({ result: 0, message: 'wrong user' })
                }
            })
        }
    })
}
