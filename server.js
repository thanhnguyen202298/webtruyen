var express = require('express')
var app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
var bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.render('home')
})
app.use(express.static(__dirname + '/public'))

// eslint-disable-next-line no-undef
app.listen(process.env.port || 3000)

// config
const config = {
    domain: 'http://localhost:3000',
    dbMongo: {
        server: 'cluster0.dzcc7hj.mongodb.net',
        username: 'thanh',
        password: 'mdko123',
        dbName: 'DataCenter',
    },
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}
var {
    isAdmin,
    validUser,
    findToken,
    findUser,
} = require('./middlewares/checkAdmin')

const middles = {
    isAdmin,
    validUser,
    validateEmail,
    findToken,
    findUser,
}

var mongoose = require('mongoose')

mongoose
    .connect(
        'mongodb+srv://' +
            config.dbMongo.username +
            ':' +
            config.dbMongo.password +
            '@' +
            config.dbMongo.server +
            '/' +
            config.dbMongo.dbName +
            '?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log('Mongo is connected successfully')
        require('./routes/main')(app, config, middles)
        require('./routes/PostCategory')(app, config, middles)
        require('./routes/upload')(app, middles)
        require('./routes/story')(app, config, middles)
    })
    .catch((err) => {
        console.log(err)
        console.log('Mongo connected error')
    })
