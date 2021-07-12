const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, setupDB, userOneId} = require('./fixtures/db')
var userOneToken = ''

beforeAll(setupDB)

// SHOULD CREATE USER AND LOOK FOR IT
test('Should create a new user', async () => {
    //Create new user
    const response = await request(app).post('/users').send({
        name: 'Bernardo',
        email: 'test@gmail.com',
        password: 'password123'
    }).expect(201)
    
    //Assert DB changed
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assert response
    expect(response.body).toMatchObject({
        user: {
            name: 'Bernardo',
            email: 'test@gmail.com'
        }
    })
    expect(user.password).not.toBe('password123')
})

// SHOULD NOT CREATE USER
test('Should not be able to create new user', async () => {
    // Try to create a new user without name
    await request(app).post('/users').send({
        email: 'test1@gmail.com',
        password: 'password123'
    }).expect(400)

    // Try to create a new user without email
    await request(app).post('/users').send({
        name: 'Bernardo',
        password: 'password123'
    }).expect(400)

    // Try to create a new user without password
    await request(app).post('/users').send({
        name: 'Bernardo',
        email: 'test1@gmail.com'
    }).expect(400)

    // Try to create a new user with existing email
    await request(app).post('/users').send({
        name: 'Bernardo',
        email: 'test@gmail.com',
        password: 'password123'
    }).expect(400)

    // Try to create a new user with short password
    await request(app).post('/users').send({
        name: 'Bernardo',
        email: 'test@gmail.com',
        password: 'pas123'
    }).expect(400)
})

// SHOULD LOGIN USER
test('Should login user', async () => {
    // Login user
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Save token
    userOneToken = response.body.token

    // Assert response
    expect(response.body).toMatchObject({
        token: response.body.token,
        user: {
            name: 'Rodrigo',
            email: userOne.email
        }
    })
})

// SHOULD NOT BE ABLE TO LOGIN USER
test('Should not login user', async () => {
    // Try to login with wrong email
    await request(app).post('/users/login').send({
        email: "test1@gmail.com",
        password: "password123"
    }).expect(400)

    // Try to login with wrong password
    await request(app).post('/users/login').send({
        email: "test@gmail.com",
        password: "password124"
    }).expect(400)
})

// SHOULD UPDATE USER
test('Should update user', async () => {
    // Update user
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({
            name: 'Rodri'
        })
        .expect(200)
    
    // Assert response
    expect(response.body).toMatchObject({
        name: 'Rodri',
        email: userOne.email
    })
})

// SHOULD NOT BE ABLE TO UPDATE USER
test('Should not update user', async () => {
    // Try to update user with incorrect token
    await request(app).patch('/users/me')
        .set('Authorization', 'Bearer ')
        .send({
            name: 'Flor'
        })
        .expect(401)
})

// SHOULD DELETE USER
test('Should delete user', async () => {
    // Delete user
    await request(app).delete('/users/me')
        .set('Authorization', 'Bearer ' + userOneToken)
        .expect(200)

    // Look for user
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// SHOULD NOT BE ABLE TO DELETE USER
test('Should not delete user', async () => {
    // Try to delete user without token
    await request(app).delete('/users/me')
        .expect(401)
})