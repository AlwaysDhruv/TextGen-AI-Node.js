import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import './Auth.css';

function AuthPage() {
  const location = useLocation();
  // Read the state from the link, default to login view if no state is passed
  const [isLogin, setIsLogin] = useState(location.state?.isLoginView ?? true);

  // This ensures the view updates if the user clicks another link while on the page
  useEffect(() => {
    setIsLogin(location.state?.isLoginView ?? true);
  }, [location.state]);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="auth-page-container">
      <div className="bg-animation">
        {Array.from({ length: 256 }).map((_, i) => <span key={i}>*</span>)}
      </div>
      <div className="auth-wrapper">
        <div className="auth-container">
          {isLogin ? (
            <LoginForm onSwitchToSignup={switchToSignup} />
          ) : (
            <SignUpForm onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;