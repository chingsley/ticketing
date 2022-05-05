import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from '@chingsley_tickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const orderCancelledListener = new OrderCancelledListener(natsWrapper.client);
  const orderCreatedListener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(), // ticket owner id
  });
  await ticket.save();

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const orderCreatedData: OrderCreatedEvent['data'] = {
    id: orderId,
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(), // userId of user that places order
    expiresAt: '2020-09-09',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake data event
  const orderCancelledData: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    orderCancelledListener,
    orderCreatedListener,
    orderCancelledData,
    orderCreatedData,
    msg,
  };
};

it('sets the orderId of the ticket', async () => {
  const {
    orderCreatedListener,
    orderCancelledListener,
    orderCreatedData,
    orderCancelledData,
    msg,
  } = await setup();

  // call the onMessage function with the data object + message object
  await orderCreatedListener.onMessage(orderCreatedData, msg);

  // write assertions to make sure a ticket was updated with orderId = null
  let ticket = await Ticket.findById(orderCreatedData.ticket.id);
  expect(ticket!.orderId).toEqual(orderCreatedData.id);

  await orderCancelledListener.onMessage(orderCancelledData, msg);
  ticket = await Ticket.findById(orderCancelledData.ticket.id);
  expect(ticket!.orderId).toEqual(null);
});

it('acks the message', async () => {
  const {
    orderCancelledListener: listener,
    orderCancelledData: data,
    msg,
  } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const {
    orderCancelledListener: listener,
    orderCancelledData: data,
    msg,
  } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).toEqual(null);
});
