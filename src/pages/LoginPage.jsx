import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('analyst@example.com');

  const onSubmit = (event) => {
    event.preventDefault();
    login(email);
    window.location.hash = '/list';
  };

  return (
    <div className="login-page">
      <form className="card" onSubmit={onSubmit}>
        <h2>Employee Insights Dashboard</h2>
        <p>Sign in to continue</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
