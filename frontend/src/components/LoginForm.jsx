import React, { useState } from 'react';

function LoginForm({ onSwitchToSignup, onSwitchToForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
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
        // ✅ Redirect to chat interface
        window.location.href = '/Chat/index.html';
      } else {
        setErrorMsg(data.msg || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Server error. Please try again later.');
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

        {errorMsg && (
          <p style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {errorMsg}
          </p>
        )}

        <button type="submit">Login</button>
      </form>

      {/* Forgot Password link */}
      <div className="redirect-link">
        <a onClick={onSwitchToForgot} style={{ cursor: 'pointer' }}>
          Forgot Password?
        </a>
      </div>

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
