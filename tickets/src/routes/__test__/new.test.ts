import { natsWrapper } from '../../nats-wrapper'; // even though the relative path points to the actual impmementaiton of nats-wrapper, jest will intead import the mock version from '__mock__'
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('returns 401 if user is not signed in', async () => {
  // not attaching .expect to request(app)... will always pass if you don't 'await'
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('will not return 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Ticketing 1', price: -10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Ticketing 1' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'aslkdja';

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price: 20 });

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'aslkdja';

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
