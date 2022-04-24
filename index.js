process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

const cookie = 'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5TldNeVltWXpZbVExTXpKak9UTTFaamhtTVRJNFppSXNJbVZ0WVdsc0lqb2laVzVsYW1FdWEyTkFaMjFoYVd3dVkyOXRJaXdpYVdGMElqb3hOalV3TWpBM056TTNmUS55X3VPaVlMMVRJWE5mbUE3VzZFYm9nN3VDNkppYllSMVBSbXM3RGpFbzFRIn0=';

const doRequest = async () => {
  const { data } = await axios.post(
    'https://ticketing.dev/api/tickets',
    { title: 'ticket', price: 5 },
    {
      headers: { cookie }
    }
  );


  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie }
    }
  );

  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie }
    }
  );

  console.log('Request completed');
};


(async () => {
  for (let i = 0; i < 400; i++) {
    doRequest();
  }
})();