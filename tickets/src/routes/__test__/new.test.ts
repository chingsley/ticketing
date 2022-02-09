import request from 'supertest';
import { app } from '../../app';

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
  // add a check to make sure a ticket was saved

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'alfklakfj', price: 20 })
    .expect(201);
});
