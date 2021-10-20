import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/auth-error";
import { errorCodes } from "../constants/error-codes";

const { USER_NOT_SIGNED_IN } = errorCodes;

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError(USER_NOT_SIGNED_IN);
  }

  next();
};