const { test } = require('@jest/globals')
const request = require('supertest')
const app = require('../src/app')

test('Should create a new model', async () => {
    await request(app).post('/models').send({
        fieldOne: 'fieldOne',
        fieldTwo: 25
    }).expect(201)
})

test('Should get the list of models', async () => {
    await request(app).get('/models').send().expect(200)
})