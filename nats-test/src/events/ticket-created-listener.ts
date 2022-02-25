import { Subjects } from './subjects';
import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated; // same as the line above
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);
    console.log(data.title);
    console.log(data.price);
    console.log(data.id);

    msg.ack();
  }
}
