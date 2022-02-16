import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  constants,
  validateObjectId,
} from '@chingsley_tickets/common';
import { Ticket } from '../models/ticket';

const { WRONG_TICKET_OWNER } = constants.errorCodes;

const router = express.Router();

router.delete(
  '/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    validateObjectId(req.params.id);
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError(`no ticket found for id ${req.params.id}`);
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError(WRONG_TICKET_OWNER);
    }

    await Ticket.deleteOne({ _id: ticket.id });
    res.status(200).send({ message: 'ticket deleted' });
  }
);

export { router as removeTicketRouter };
