import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@chingsley_tickets/common';
import { Order } from '../models/order';


const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError(`no order matches the id of ${req.params.orderId}`);
  }
  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError('0RD001');
  }
  res.send(order);
});

export { router as showOrderRouter };
