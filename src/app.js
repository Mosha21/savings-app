const express = require('express')
require('./db/mongoose')
const modelRouter = require('./routers/model')

const app = express()

app.use(express.json())
app.use(modelRouter)

module.exports = app