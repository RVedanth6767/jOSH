import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/list" replace />;
  }

  const from = location.state?.from?.pathname || '/list';

  const onSubmit = (event) => {
    event.preventDefault();
    const result = login(form.username, form.password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="centered-page">
      <form className="card login-card" onSubmit={onSubmit}>
        <h1>Employee Dashboard Login</h1>
        <p className="small-muted">Use testuser / Test123</p>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          required
          value={form.username}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
          type="password"
          value={form.password}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
