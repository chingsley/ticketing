import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  constants,
} from '@chingsley_tickets/common';
import { Ticket } from '../models/ticket';

const { WRONG_TICKET_OWNER } = constants.errorCodes;

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError(`no ticket found for id ${req.params.id}`);
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError(WRONG_TICKET_OWNER);
    }
    /**
     // method 1
     const result = await Ticket.updateOne(
      { _id: ticket.id },
      { $set: req.body }
    );

    // method 2:
    ticket.set({ title: req.body.title, price: req.body.title })
     */

    ticket.set(req.body);
    await ticket.save();
    res.send(ticket);
  }
);

export { router as updateTicketRouter };