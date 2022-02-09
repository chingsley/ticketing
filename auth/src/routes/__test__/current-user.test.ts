import request from 'supertest';
import { app } from '../../app';

it('gets current user info', async () => {
  const email = 'test@test.com';
  const cookie = await global.signin({ email, password: 'password' });

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual(email);
});

it('returns null value for currentUser if user is not signed in (i.e no Cookie was set)', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(res.body.currentUser).toEqual(null);
});
