import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string; // SEE: ticketSchema.statics.build BELOW => we don't want mongoose to generate an _id for the ticket. Instead we want the _id here to equal the _id of the same ticket from ticket service
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
  build(attrs: TicketAttrs): TicketDoc;
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
  const { id, ...rest } = attrs;
  return new Ticket({
    _id: id,
    ...rest,
  });
};

ticketSchema.methods.isReserved = async function() { 
  // This isReserved instance method must be defined with the 'function' keyword NOT arrow =>
  // so that 'this' keyword will refer the the instance on which isReserved is called,
  // and NOT refer to the Ticket model generatlly
  const existingOrder  = await Order.findOne({
    ticket: this as any, // "this" the ticket instance on which "isReserved" is called. Outside here, this would be replaced by the tccket instance
    status: { $ne: OrderStatus.Cancelled }
  });

  return !!existingOrder;

}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
