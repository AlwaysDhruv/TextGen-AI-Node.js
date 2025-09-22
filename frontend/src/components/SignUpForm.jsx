import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpForm({ onSwitchToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // FIX: backend expects `name`, not `fullName`
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/'); // Redirect to home on successful signup
      } else {
        // Show backend error message if available
        alert(data.msg || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Server error. Please try again.');
    }
  };
// Inside your login or signup submission handler
async function handleLogin(e) {
  e.preventDefault();
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Assuming your backend sends the user name upon successful login
      // You would save this to a global state or local storage
      localStorage.setItem('userName', data.user.name); 
      // Redirect to the home page or dashboard
    } else {
      // Handle login error
      console.error(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}

  return (
    <div id="signup-view">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
      <div className="redirect-link">
        Already have an account? <a onClick={onSwitchToLogin}>Login</a>
      </div>
    </div>
  );
}

export default SignUpForm;
