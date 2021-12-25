import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';


import { errorHandler, NotFoundError } from '@chingsley_tickets/common';


const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.get('/api/users/healthcheck', (req, res) => {
  res.send('Auth service is up and running....');
});

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app };