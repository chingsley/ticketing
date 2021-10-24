import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { sendRequest, errors, setErrors } = useRequest();
  const emailError = errors.find(({ field }) => field === 'email');
  const passwordError = errors.find(({ field }) => field === 'password');
  console.log('emailError', emailError);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    sendRequest({
      url: '/api/users/signup',
      body: formData,
      method: 'post',
      onSuccess: () => Router.push('/')
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign UP</h1>
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input
          type='text'
          className={emailError ? 'form-control input-error' : 'form-control'}
          name='email'
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      {console.log('errors: ', errors)}
      <div className='form-group'>
        <label htmlFor='password'>Email Address</label>
        <input
          type='password'
          className={
            passwordError ? 'form-control input-error' : 'form-control'
          }
          name='password'
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
}

export default Signup;
