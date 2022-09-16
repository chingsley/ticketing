import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from '@chingsley_tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
