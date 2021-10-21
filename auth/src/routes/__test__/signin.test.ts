import request from 'supertest';
import { app } from '../../app';
import { errorCodes } from '../../constants/error-codes';
import { messages } from '../../constants/messages';

it('returns status 401 with errorCode AUTH001 if email does not exist', async () => {
  const res = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password'})
    .expect(401);
  
  const { errors: [{ message, errorCode }] } = res.body;
  expect(errorCode).toEqual(errorCodes.EMAIL_NOT_FOUND)
  expect(message).toEqual(messages.INVALID_CREDENTIALS)

});

it('returns 401 and errorCode AUTH002 for wrong password', async () => {
  const email = 'test@test.com';
  
  await request(app)
    .post('/api/users/signup')
    .send({ email, password: 'password'})
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({ email, password: 'aldklajf'})

    expect(res.status).toBe(401)

    const { errors: [{  errorCode }] } = res.body;
    expect(errorCode).toEqual(errorCodes.WRONG_PASSWORD)
})


it('returns a cookie on successful signin', async () => {
  const password = 'password';
  const email = 'test@test.com';
  await request(app)
    .post('/api/users/signup')
    .send({ email,  password })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({ email, password })

    expect(res.status).toBe(200)
    
    expect(res.get('Set-Cookie')).toBeDefined();
})