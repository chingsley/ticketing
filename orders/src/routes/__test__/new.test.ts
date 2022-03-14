import mongoose from 'mongoose';
// import { natsWrapper } from '../../nats-wrapper'; // even though the relative path points to the actual impmementaiton of nats-wrapper, jest will intead import the mock version from '__mock__'
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';


it('returns an error if the ticket does not exist', async() => {
  const ticketId  = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
})


it('returns an error if the ticket is already reserved', async() => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'slkafljalf',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ ticketId: ticket.id })
  .expect(400);

})

it('reserves a ticket', async() => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ ticketId: ticket.id })
  .expect(201);
})