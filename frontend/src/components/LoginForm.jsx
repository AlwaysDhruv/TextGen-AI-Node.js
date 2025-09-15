import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/'); // Redirect to home page on successful login
      } else {
        alert(data.msg || 'Login failed.');
      }
    } catch (err) {
      alert('Server error. Please try again.');
    }
  };

  return (
    <div id="login-view">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="redirect-link">
        Don't have an account? <a onClick={onSwitchToSignup}>Sign Up</a>
      </div>
    </div>
  );
}

export default LoginForm;