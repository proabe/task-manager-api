const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOne, userOneId, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'Andrew',
        email: 'abesingh1@gmail.com',
        password: 'pass@123'
    }).expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'abesingh1@gmail.com'
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('pass@123');
})

test('Should login an existing user', async() => {
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
})

test('Should not login an non-existing user', async() => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        password: 'jgfkhg'
    }).expect(400)
})

test('Should get user profile', async() => {
    await request(app).get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
})

test('Should delete a user account an authenticated user', async() => {
    const  response = await request(app).delete('/user/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull()
})

test('Should not delete a user account of an unauthenticated user', async() => {
    await request(app).delete('/user/me')
    .set('Authorization', `Bearer asdbljsahdkln`)
    .send()
    .expect(401);
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/user/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

        const user = await User.findById(userOneId);
        expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should update a valid user fields', async () =>{
    const response = await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "John"
        }).expect(200)

    expect(response.body.name).toBe("John");
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: ""
        }).expect(400)
})