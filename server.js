require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 3000
const logger = require('morgan')
const route= require('./routes')
const bodyParser = require('body-parser')
const secureApp = require("helmet")
const db = require("./db")


const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(secureApp())
app.use(express.static('publics'))

db.connect()

route(app)

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))