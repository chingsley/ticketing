import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { sendRequest } = useRequest();

  const placeOrder = () => {
    sendRequest({
      url: '/api/orders',
      method: 'post',
      body: {
        ticketId: ticket.id,
      },
      onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
    });
  };
  return <div>
    <h1>${ticket.title}</h1>
    <h4>Price: {ticket.price}</h4>
    <button onClick={placeOrder} className="btn btn-primary">Purchase</button>
  </div>;
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;