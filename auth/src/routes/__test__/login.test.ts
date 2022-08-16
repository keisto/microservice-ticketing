import request from 'supertest'
import { app } from '../../app'

it('fails when email supplied does not exist.', async () => {
  return request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201)

  return request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: 'pass' })
    .expect(400)
})

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/register')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201)

  const response = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
