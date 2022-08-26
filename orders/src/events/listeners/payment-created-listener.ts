import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
} from '@keisto/ticketbooth-common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order, OrderStatus } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId, stripeId } = data
    const order = await Order.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({
      status: OrderStatus.Complete,
    })
    await order.save()

    // Should publish an order updated event here,
    // but we aren't doing thing with the order after its complete

    msg.ack()
  }
}
