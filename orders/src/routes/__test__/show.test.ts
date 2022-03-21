import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';


it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
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
  .get(`/api/orders/${order.id}`)
  .set('Cookie', user)
  .send()
  .expect(200);

  expect(res.body.id).toEqual(order.id);
  expect(res.body.ticket.id).toEqual(ticket.id);

})

it('ensures user cannot get another user"s order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
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
  .get(`/api/orders/${order.id}`)
  .set('Cookie', global.signin())
  .send()
  .expect(401);
})