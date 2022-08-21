import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@keisto/ticketbooth-common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
