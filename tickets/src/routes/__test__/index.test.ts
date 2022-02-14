import request from 'supertest';
import { app } from '../../app';
import { faker } from '@faker-js/faker';

function createTicket() {
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: faker.random.randomWord(),
    price: faker.datatype.number({ min: 10, max: 1000 })
  });
};

it('should return same length as number of tickets created', async () => {
   await createTicket();
 await createTicket();
// console.log(res1.body, res2.body)

  const response = await request(app)
  .get('/api/tickets')
  .expect(200);
  // console.log(response.body)

  expect(response.body).toHaveLength(2);
})