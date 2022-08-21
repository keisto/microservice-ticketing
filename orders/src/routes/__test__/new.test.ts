import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

it('returns an error if ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.login())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'asdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.login())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.login())
    .send({ ticketId: ticket.id })
    .expect(201)

  // could check db to verify order was saved
})

it('emits order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.login())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
