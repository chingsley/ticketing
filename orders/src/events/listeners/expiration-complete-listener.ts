import { OrderCancelledPublisher } from './../publishers/order-cancelled-publisher';
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ExpirationCompleteEvent, OrderStatus } from '@chingsley_tickets/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new Error('Expiration-complete-lister: Order not found');
    }

    if (order.status === OrderStatus.Complete) return msg.ack();

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // publishing an order:cancelled event
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });
    msg.ack();
  }
}