import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { response } from 'express'

it('returns a 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})

it('returns a ticket if found', async () => {
  const title = 'ticket'
  const price = 10

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.login())
    .send({ title, price })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
})
