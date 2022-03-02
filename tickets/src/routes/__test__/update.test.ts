import { natsWrapper } from '../../nats-wrapper';
import { constants } from '@chingsley_tickets/common';
import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { app } from '../../app';

const { WRONG_TICKET_OWNER, USER_NOT_SIGNED_IN } = constants.errorCodes;

const validPalyload = () => ({
  title: faker.random.randomWord(),
  price: faker.datatype.number({ min: 10, max: 1000 }),
});

describe('Update Ticket', () => {
  it('returns a 404 if the provided id does not exist', async () => {
    const payload = validPalyload();
    const testId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
      .put(`/api/tickets/${testId}`)
      .set('Cookie', global.signin())
      .send(payload)
      .expect(404);

    const { errors } = res.body;
    expect(errors[0].message).toMatch(
      new RegExp(`no ticket found for id ${testId}`)
    );
  });

  it('returns 401 if the user is not authenticated', async () => {
    const payload = validPalyload();
    const testId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
      .put(`/api/tickets/${testId}`)
      .send(payload)
      .expect(401);

    const { errors } = res.body;
    expect(errors[0].message).toMatch('Not authorized');
    expect(errors[0].errorCode).toMatch(new RegExp(`${USER_NOT_SIGNED_IN}`));
    // console.log(res.status);
  });

  it('returns a 401 if the user does not own the ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send(validPalyload())
      .expect(201);

    const { id } = res.body;
    const payload = validPalyload();
    const res2 = await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send(payload)
      .expect(401);
    const { errors } = res2.body;
    expect(errors[0].message).toMatch('Not authorized');
    expect(errors[0].errorCode).toMatch(new RegExp(`${WRONG_TICKET_OWNER}`));
  });

  it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send(validPalyload())
      .expect(201);
    const res2 = await request(app)
      .put(`/api/tickets/${res.body.id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 20 })
      .expect(400);
    const res3 = await request(app)
      .put(`/api/tickets/${res.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'some title', price: -20 })
      .expect(400);

    const { errors: titleError } = res2.body;
    const { errors: priceError } = res3.body;
    expect(titleError[0].message).toMatch(/title is required/i);
    expect(priceError[0].message).toMatch(/price must be greater than 0/i);
  });

  it('updates the ticked given valid inputs if the authenticated user owns the ticket', async () => {
    const cookie = global.signin();
    const { title: newTitle, price: newPrice } = validPalyload();
    const res = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send(validPalyload())
      .expect(201);
    await request(app)
      .put(`/api/tickets/${res.body.id}`)
      .set('Cookie', cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(200);
    const res3 = await request(app)
      .get(`/api/tickets/${res.body.id}`)
      .expect(200);

    // console.log({ newTitle, newPrice }, res3.body);
    expect(res3.body.title).toEqual(newTitle);
    expect(res3.body.price).toEqual(newPrice);
  });
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const { title: newTitle, price: newPrice } = validPalyload();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(validPalyload())
    .expect(201);
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);
  await request(app).get(`/api/tickets/${res.body.id}`).expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
