require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 3000
const logger = require('morgan')
const route = require('./src/routes')
const bodyParser = require('body-parser')
const secureApp = require("helmet")
const db = require("./src/db")


const app = express()

app.use(logger('dev'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
// app.use(bodyParser.json())
app.use(secureApp())
app.use(express.static('./src/publics'))

db.connect()

route(app)

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))