import React, { useState } from 'react';

function LoginForm({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        if (data.user && data.user.name) {
          localStorage.setItem('userName', data.user.name);
        } else {
          console.warn('User name not found in API response.');
          localStorage.removeItem('userName');
        }
        window.location.href = '/Chat/index.html';
      } else {
        alert(data.msg || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
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
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="redirect-link">
        Don&apos;t have an account?{' '}
        <a onClick={onSwitchToSignup} style={{ cursor: 'pointer' }}>
          Sign Up
        </a>
      </div>
    </div>
  );
}

export default LoginForm;
