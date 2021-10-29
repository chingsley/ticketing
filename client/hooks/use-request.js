import axios from 'axios';
import { useState } from 'react';

import { toast } from 'react-toastify';

const useRequest = () => {
  const [errors, setErrors] = useState([]);

  const sendRequest = async ({ url, method, body, onSuccess }) => {
    try {
      const response = await axios[method](url, body);
      onSuccess(response.data);
      return response.data;
    } catch (err) {
      const { errors } = err.response.data;
      setErrors(errors);
      for (let error of errors) {
        toast.error(error.message);
      }
    }
  };
  return { sendRequest, errors, setErrors };
};

export default useRequest;
