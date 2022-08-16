import request from 'supertest'
import { app } from '../../app'

it('returns 201 on successful registration.', async () => {
  return request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201)
})

it('disallows duplicate emails.', async () => {
  await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201)

  return request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400)
})

it('returns 400 with invalid email.', async () => {
  return request(app)
    .post('/api/users/register')
    .send({ email: 'testtest.com', password: 'password' })
    .expect(400)
})

it('returns 400 with invalid password.', async () => {
  return request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 's' })
    .expect(400)
})

it('returns 400 with missing email and password.', async () => {
  await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com' })
    .expect(400)

  return request(app)
    .post('/api/users/register')
    .send({ password: 's' })
    .expect(400)
})

it('sets a cookie after successful registration.', async () => {
  const response = await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})
