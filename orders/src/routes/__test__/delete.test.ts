import mongoose from 'mongoose';
import { OrderStatus } from '@chingsley_tickets/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper'; // even though the relative path points to the actual impmementaiton of nats-wrapper, jest will intead import the mocked version from '__mock__'


it('marks an order as cancelled', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();


  const user = global.signin();

  // make a request to build an order with this ticket
  const { body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user)
  .send({ ticketId: ticket.id })
  .expect(201);

  // make request to fetch the ordder
  const res = await request(app)
  .delete(`/api/orders/${order.id}`)
  .set('Cookie', user)
  .send()
  .expect(200);

  expect(res.body.id).toEqual(order.id);
  expect(res.body.status).toEqual(OrderStatus.Cancelled);

  // confirm that order status is updated in db
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('ensures user cannot cancel another user"s order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();


  const user = global.signin();

  // make a request to build an order with this ticket
  const { body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user)
  .send({ ticketId: ticket.id })
  .expect(201);

  // make request to fetch the ordder
  const res = await request(app)
  .delete(`/api/orders/${order.id}`)
  .set('Cookie', global.signin())
  .send()
  .expect(401);

  const { errors: [{message}] } = res.body;
  expect(message).toMatch(/not authorized/i)
});

it("emits an order cancelled event", async () => {
    // Create a ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    });
    await ticket.save();
  
  
    const user = global.signin();
  
    // make a request to build an order with this ticket
    const { body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  
    // make request to fetch the ordder
    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});