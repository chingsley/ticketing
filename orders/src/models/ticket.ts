import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';


interface TicketAttrs {
  title: string;
  price: number;
}

// the instance of a ticket
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketAttrs;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function() { 
  // isReserved function must be 'function' keyword NOT arrow =>
  // so that 'this' keyword will refer the the instance on which isReserved is called,
  // and NOT refer to the Ticket model generatlly
  const existingOrder  = await Order.findOne({
    ticket: this, // "this" the ticket instance on which "isReserved" is called. Outside here, this would be replaced by the tccket instance
    status: { $ne: OrderStatus.Cancelled }
  });

  return !!existingOrder;

}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
