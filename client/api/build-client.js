import axios from 'axios';

/**
 * 
 * @param {object} param0 context: default object passed by next
 * @returns  return a preconfigured version of axios depending
 * ... on the environment (server or browser)
 */
const buildClient =  ({ req }) => {
  // console.log(req.headers)
  
  if (typeof window === 'undefined') {
    // we are on the client server
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // we are on the browser
    return axios.create({
      baseURL: '/' // we can also leave out the baseURL entirely, the browser will pass it along with the headers automatically
    })
  }
}

export default buildClient;