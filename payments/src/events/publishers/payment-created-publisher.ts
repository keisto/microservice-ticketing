import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@keisto/ticketbooth-common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
