import { useEffect } from "react";
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { sendRequest } = useRequest();

  useEffect(() => {
    sendRequest({
      url: '/api/users/signout',
      method: 'post',
      body: {},
      onSuccess: () => Router.push('/')
    });
  }, []);

  return <div>Signing you out...</div>;
};