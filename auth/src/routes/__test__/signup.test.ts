import request from 'supertest';
import { app } from '../../app';

it('returns 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});
it('returns 400 for invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'lafjlaflj',
      password: 'password',
    })
    .expect(400);
});
it('returns 400 for invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1',
    })
    .expect(400);
});
it('returns 400 for missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password'
    })
    .expect(400);
});
it('returns 409 for duplicate password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password2'
    })
    .expect(409);
});
it('sets a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
    // console.log({'res.body': res.body, 'res.header': res.header, 'res.headers': res.headers})
    // console.log(res.get('Set-Cookie'), res.headers['set-cookie'])
    expect(res.get('Set-Cookie')).toBeDefined();
});