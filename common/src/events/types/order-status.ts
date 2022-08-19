export enum OrderStatus {
  // When order has been created but the ticket it is trying to order has not been reserved
  Created = 'created',

  // The ticket the order is trying to reserve has already been reserved,
  // or when user has cancelled
  // or the order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // The order has reserved the ticket and the user has provided a payment successfully
  Complete = 'complete',
}
