import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@chingsley_tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}