const express = require('express')
const passport = require('passport')
const User = require('../models/user')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        const token = await newUser.generateAuthToken()

        res.status(201).send({ user: newUser, token })
    } catch (error) {
        res.status(400).send(error)
    }
})
  
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.status(200).json({ user: req.user })
})

router.patch('users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if(!isValidUpdate) res.status(400).send({ error: 'Invalid update!' })

    try {
        updates.forEach(update => req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router