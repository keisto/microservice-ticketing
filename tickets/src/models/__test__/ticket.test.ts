import { Ticket } from '../ticket'
import mongoose from 'mongoose'

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })

  await ticket.save()
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)
  console.log(firstInstance, secondInstance)

  firstInstance!.set({ price: 10 })
  await firstInstance!.save()

  secondInstance!.set({ price: 15 })

  try {
    await secondInstance!.save()
  } catch (err) {
    return
  }

  throw new Error('Should not reach this point.')
})

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })

  await ticket.save()

  expect(ticket.version).toEqual(0)

  await ticket.save()
  expect(ticket.version).toEqual(1)

  await ticket.save()
  expect(ticket.version).toEqual(2)
})
