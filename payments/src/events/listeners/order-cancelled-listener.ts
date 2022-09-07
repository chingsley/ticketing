import { Message } from 'node-nats-streaming';
import { Listener, NotFoundError, OrderCancelledEvent, OrderStatus, Subjects } from '@chingsley_tickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    });
    if (!order) throw new NotFoundError(`Order not found: order ID: ${data.id}`);
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}