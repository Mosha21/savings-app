const express = require('express')

const router = new express.Router()
const name = 'Bernardo Moya'

router.get('', (req, res) => {
    res.render('index', {
        title: 'App',
        name: name
    })
})

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: name
    })
})

router.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: name
    })
})

router.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: name,
        errorMessage: 'Page not found.'
    })
})

module.exports = router