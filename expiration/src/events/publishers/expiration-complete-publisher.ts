import { Publisher, Subjects, ExpirationCompleteEvent } from "@chingsley_tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}