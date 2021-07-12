const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Distribution = require('../../src/models/distribution')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Rodrigo',
    email: 'rodrigo@example.com',
    password: 'password123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET, { expiresIn: '1min' })
    }]
}

const setupDB = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setupDB
}