import { NotFoundError } from '@chingsley_tickets/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError(`no ticket found for id ${req.params.id}`)
  }
  res.status(200).send(ticket)
});

export { router as showTicketRouter };
