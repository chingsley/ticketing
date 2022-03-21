import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';


const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
}

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one order as User #1
   await request(app)
  .post('/api/orders')
  .set('Cookie', userOne)
  .send({ ticketId: ticketOne.id })
  .expect(201)  

  // Create two orders as User #2
  const { body: order1 } = await request(app)
  .post('/api/orders')
  .set('Cookie', userTwo)
  .send({ ticketId: ticketTwo.id })
  .expect(201)  
  const { body: order2 } = await request(app)
  .post('/api/orders')
  .set('Cookie', userTwo)
  .send({ ticketId: ticketThree.id })
  .expect(201)

  // Make request to get orders fo rUser #2
  const response = await request(app)
  .get('/api/orders')
  .set('Cookie', userTwo)
  .expect(200);

  // Make sure we only got the orders for User #2
  // console.log(response.body)
  expect(response.body).toHaveLength(2)
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)
})