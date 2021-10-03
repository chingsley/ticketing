import express from 'express';
import 'express-async-errors';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/notfound-error';


const app = express();
app.use(express.json());

app.get('/api/users/healthcheck', (req, res) => {
  res.send('Auth service is up and running....');
});
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);


app.listen(3000, () => {
  console.log('Listening on port 3000...');
});