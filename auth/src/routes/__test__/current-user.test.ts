import request from 'supertest';
import { app } from '../../app';

it('gets current user info', async () => {
  const email = 'test@test.com';
  const cookie = await global.signup({ email, password: 'password' });

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual(email);
});

it('returns null value for currentUser if user is not signed in', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(res.body.currentUser).toEqual(null);
});
