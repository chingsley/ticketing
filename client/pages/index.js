
import React from 'react';
import buildClient from '../api/build-client';

function LandingPage({ currentUser }) {
  console.log(currentUser);
  // axios.get('/api/users/currentuser').catch(err => console.log(err.message))
  return <h1>landing</h1>;
}

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/currentuser')
  return data; // this will be passed to the LandingPage component, where currentuser will be destructured from this 'data' object
 
 
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
  
}

export default LandingPage;
