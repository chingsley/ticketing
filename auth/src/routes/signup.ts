import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { UniqueFieldViolationError } from '../errors/unique-field-violation-error';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    // console.log(errors.array(), errors.isEmpty());
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new UniqueFieldViolationError(
        'email',
        `User with email ${existingUser.email} already exists`
      );
      // throw new BadRequestError(
      //   409,
      //   `User with email ${existingUser.email} already exists`
      // );
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on the session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);

    // console.log('creating user....');
    // throw new DatabaseConnectionError();
    // res.send({ email, password });
  }
);

export { router as signupRouter };
