const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach(async () => {
    await User.deleteMany()
})

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