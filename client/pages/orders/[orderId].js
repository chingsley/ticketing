import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { sendRequest } = useRequest();

  const createCharge = tokenId => {
    sendRequest({
      url: '/api/payments',
      method: 'post',
      body: {
        orderId: order.id,
        token: tokenId
      },
      onSuccess: () => Router.push('/orders')
    });
  };

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);



    // this function will be called:
    //    1. just before the user navigates away from the the page
    //    2. just before the page is refreshed
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return <div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout
      token={({ id }) => createCharge(id)}
      stripeKey='pk_test_OabyBG2gYCq8Jzsl6w5lGP6D00rOY6SjS1'
      amount={order.ticket.price * 100} // * 100 b/c stripe expects amoutn to be specified in cents (our order.ticke.price is in dollar, therefore we multiply it by 100 to convert it to cents)
      email={currentUser.email}
    />
  </div>;
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;