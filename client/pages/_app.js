import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/app.css';
import buildClient from '../api/build-client';

import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
      <ToastContainer />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // console.log(Object.keys(appContext));
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {

    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }
  // console.log(data);

  return { pageProps, ...data };
};

export default AppComponent;
