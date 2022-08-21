import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const user = global.login()
  // make a request to build an order with ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .send({ ticketId: ticket.id })
    .set('Cookie', user)
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if user does not own order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  // make a request to build an order with ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .send({ ticketId: ticket.id })
    .set('Cookie', global.login())
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.login())
    .expect(401)
})
