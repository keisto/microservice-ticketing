import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@keisto/ticketbooth-common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
