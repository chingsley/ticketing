import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { messages as msg } from '../constants/messages';

const router = express.Router();

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
      throw new BadRequestError(INVALID_CREDENTIALS, 401, 'AUTH001');
    }
    const matchingPassword = await user.matchPassword(password);
    if (!matchingPassword) {
      throw new BadRequestError(INVALID_CREDENTIALS, 401, 'AUTH002');
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
