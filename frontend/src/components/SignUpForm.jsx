import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpForm({ onSwitchToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.msg || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Server error. Please try again.');
    }
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (error) setError('');
  };
  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val);
    if (error) setError('');
  };

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
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />
          <i
            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <div className="password-container">
          <input
            className="input-field"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            required
          />
          <i
            className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          ></i>
        </div>

        {error && (
          <div className="form-error" style={{ color: 'red', marginBottom: '8px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={
            !fullName ||
            !email ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
        >
          Sign Up
        </button>
      </form>
      <div className="redirect-link">
        Already have an account? <a onClick={onSwitchToLogin}>Login</a>
      </div>
    </div>
  );
}

export default SignUpForm;
