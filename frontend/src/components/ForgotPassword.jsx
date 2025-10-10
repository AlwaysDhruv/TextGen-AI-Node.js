import React, { useState } from 'react';

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stage, setStage] = useState('email'); // 'email' -> 'otp' -> 'done'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // --- STEP 1: Send OTP ---
  const handleSendOtp = async () => {
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ OTP sent successfully! Check your email.');
        setStage('otp');
      } else {
        setMessage(data.msg || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setMessage('⚠️ Server error while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Verify OTP & Reset Password ---
  const handleVerifyOtp = async () => {
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Password reset successfully!');
        setStage('done');
      } else {
        setMessage(data.msg || 'Invalid OTP or expired.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setMessage('⚠️ Server error while verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      {/* STEP 1: Enter Email */}
      {stage === 'email' && (
        <>
          <input
            className="input-field"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {/* STEP 2: Enter OTP and New Password */}
      {stage === 'otp' && (
        <>
          <input
            className="input-field"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          {/* New Password field with eye toggle */}
          <div className="password-container">
            <input
              className="input-field"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <i
              className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>

          {/* Confirm Password field with eye toggle */}
          <div className="password-container">
            <input
              className="input-field"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <i
              className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>

          <button onClick={handleVerifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {/* STEP 3: Success message */}
      {stage === 'done' && (
        <p style={{ color: 'lightgreen', marginTop: '10px' }}>
          ✅ Password reset successfully! You can now log in.
        </p>
      )}

      {/* Feedback Message */}
      {message && (
        <p
          style={{
            color: message.startsWith('✅')
              ? 'lightgreen'
              : message.startsWith('❌')
              ? '#ff6b6b'
              : '#a5b4fc',
            marginTop: '10px',
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}

      <div className="redirect-link">
        <a onClick={onBackToLogin} style={{ cursor: 'pointer' }}>
          Back to Login
        </a>
      </div>
    </div>
  );
}

export default ForgotPassword;
