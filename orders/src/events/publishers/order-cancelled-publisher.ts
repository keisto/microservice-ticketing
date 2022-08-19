import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@keisto/ticketbooth-common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
