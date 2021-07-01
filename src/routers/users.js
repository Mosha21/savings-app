const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/register', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        //generate token
        res.status(201).send({ newUser })
    } catch (error) {
        res.status(400).send(error)
    }
})
  
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"})
})

module.exports = router