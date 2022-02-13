import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  const testId = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app).get(`/api/tickets/${testId}`).expect(404);
  const { errors } = res.body;
  expect(errors[0].message).toMatch(new RegExp(`no ticket found for id ${testId}`));
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);
    // console.log(ticketResponse.body)

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
