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

describe('Remove Ticket', () => {
  it('returns a 404 if the provided id does not exist', async () => {
    const testId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
      .delete(`/api/tickets/${testId}`)
      .set('Cookie', global.signin())
      .expect(404);

    const { errors } = res.body;
    expect(errors[0].message).toMatch(
      new RegExp(`no ticket found for id ${testId}`)
    );
  });

  it('returns 401 if the user is not authenticated', async () => {
    const testId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).delete(`/api/tickets/${testId}`).expect(401);

    const { errors } = res.body;
    expect(errors[0].message).toMatch('Not authorized');
    expect(errors[0].errorCode).toMatch(new RegExp(`${USER_NOT_SIGNED_IN}`));
  });

  it('returns a 401 if the user does not own the ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send(validPalyload())
      .expect(201);

    const { id } = res.body;
    const res2 = await request(app)
      .delete(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .expect(401);
    const { errors } = res2.body;
    expect(errors[0].message).toMatch('Not authorized');
    expect(errors[0].errorCode).toMatch(new RegExp(`${WRONG_TICKET_OWNER}`));
  });

  it('returns a 400 ticket id is not a valid object id', async () => {
    const invalidId = 'alkflajflajlf';
    const res = await request(app)
      .delete(`/api/tickets/${invalidId}`)
      .set('Cookie', global.signin())
      .expect(400);

    const { errors } = res.body;
    expect(errors[0].message).toMatch(
      new RegExp(`${invalidId} is not a valid ObjectId`)
    );
  });

  it('removes the ticked given valid ticket id and the authenticated user owns the ticket', async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send(validPalyload())
      .expect(201);
    await request(app)
      .delete(`/api/tickets/${res.body.id}`)
      .set('Cookie', cookie)
      .expect(200);
    const res3 = await request(app)
      .get(`/api/tickets/${res.body.id}`)
      .expect(404);

    const {
      errors: [{ message: receivedErr }],
    } = res3.body;
    const expectedErr = new RegExp(`no ticket found for id ${res.body.id}`);
    expect(receivedErr).toMatch(expectedErr);
  });
});
