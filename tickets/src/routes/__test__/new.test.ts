import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('has a route handler for /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is logged in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})

it('returns status other than 401 if user logged in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({})

  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({ title: '', price: 10 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({ price: 10 })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({ title: 'title', price: -10 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({ title: 'title' })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({ title: 'title', price: 10 })
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(10)
})

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({ title: 'title', price: 10 })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
