const express = require('express')
const Model = require('../models/model')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/models', auth, async (req, res) => {
    const model = new Model(req.body)

    try {
        await model.save()

        res.status(201).send({ model })
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('./models', async (req, res) => {
    const models = await Model.find()
    
    res.send(models)
})

module.exports = router