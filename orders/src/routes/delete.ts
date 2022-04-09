import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError, requireAuth } from '@chingsley_tickets/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from './../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

/**
 * NOTE: We will not actually be deleting the order, instead will
 * update the order status to "Cancelled".
 * 
 * A better approach is to make this a patch request instead
 */
router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError(`no order matches the id of ${req.params.orderId}`);
  }
  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError('0RD001');
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // publishing an order:cancelled event
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  })

  res.send(order);
});

export { router as deleteOrderRouter };
