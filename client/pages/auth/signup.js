import { useState } from 'react';
import axios from 'axios';

function Signup  () {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors ] = useState([])

  const handleInputChange = (e) => {
    setFormData({  ...formData, [e.target.name]: e.target.value})
  }
  
  const onSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/users/signup', formData);
      console.log(res.data)
    } catch(err) {
      console.log(err.response.data)
      setErrors(err.response.data.errors)
    }

  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign UP</h1>
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input type='text' className='form-control' name="email" value={formData.email} onChange={handleInputChange}/>
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Email Address</label>
        <input type='password' className='form-control' name="password"  value={formData.password} onChange={handleInputChange}/>
      </div>
      {errors.length > 0 && (
          <div className="alert alert-danger">
            <h4>Ooops...</h4>
            <ul className="my-0">
              {errors.map(err => <li key={err.message}>{err.message}</li>)}
            </ul>
        </div>
      )}
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};

export default Signup;
