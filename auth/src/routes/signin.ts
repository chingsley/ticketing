import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@chingsley_tickets/common';
import { User } from '../models/user';
import { messages as msg } from '../constants/messages';
import { errorCodes } from '../constants/error-codes';

const router = express.Router();

const { EMAIL_NOT_FOUND, WRONG_PASSWORD } = errorCodes;

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { INVALID_CREDENTIALS } = msg;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError(INVALID_CREDENTIALS, 401, EMAIL_NOT_FOUND);
    }
    const matchingPassword = await user.matchPassword(password);
    if (!matchingPassword) {
      throw new BadRequestError(INVALID_CREDENTIALS, 401, WRONG_PASSWORD);
    }
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };
    res.send(user);
  }
);

export { router as signinRouter };
