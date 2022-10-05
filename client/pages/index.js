import React from 'react';
import Link from 'next/Link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };

  // if (typeof window === 'undefined') {
  //   // we are on the client server
  //   const { data } = await axios.get(
  //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
  //       headers: req.headers
  //     }
  //   );
  //   return data; 
  // } else {
  //   // we are on the browser
  //   const { data } = await axios.get('/api/users/currentuser');
  //   return data; // recall, from the server: res.body = { currentUser: null } or { currentUser: {...} }
  // }

};

export default LandingPage;
