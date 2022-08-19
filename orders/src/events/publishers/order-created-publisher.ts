import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@keisto/ticketbooth-common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
