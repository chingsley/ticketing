import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, BadRequestError, OrderStatus } from '@chingsley_tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from './../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // this should be treated as a market config

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // NOTE: this check creates a sublte coupling with the ticketId. Cause if the structure of the ticketId changes in ticket srvice, then this service will be affectedru
      .withMessage('A valid mongodb ticketId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(`No Ticket matches the id of ${ticketId}`)
    }

    // Make sure that this ticket is not already reserved
    const isReerved = await ticket.isReserved();
    if(isReerved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    /**
     * PUblish an event saying that an order was created
     * NOTE: About 'expiresAt' sent as 'string' type in the published data:
     * whenever we share timestamps across different services, we want to
     * share them in a timezone-agnostic way. As a result, we provide a UTC timestamp
     * SEE: https://getir.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19565052#overview (TIME: 2:20)
     */
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      }
    })

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
