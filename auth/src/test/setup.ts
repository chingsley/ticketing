import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

/**
 *  This is to inform Typescript that we'll be
 * adding a global variable called signup to
 * to the NodeJS namespace. The variable is going
 * to be a function that returns a array of strings
 */
declare global {
  var signin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<string[]>;
}
let mongod: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdalfkjaf';

  mongod = await MongoMemoryServer.create();
  const mongoUri = await mongod.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  // delete all collections before each test
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongod.stop();
  await mongoose.connection.close();
});

/**
 * NOTE 1:
 * this signin function has been defined as a global variable
 * An alternative is to create it as a regular functuion and
 * export it from the file, to be imported and used from destination files
 * If you choose to export it, I would suggest that you pass the 'app'
 *  as argument to the function since most test files already imports 'app'
 *
 * NOTE 2:
 * Even though this function is defined globally, it will only be available
 * in test environment (ie. when running test). ie. It will not be available
 * when running the app in normal dev or prod mode. The reason is because
 * the function is defined in the test setup.ts files which, as defined in
 * the "jest" section of package.json, only executes when jest runs the test
 */
global.signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
