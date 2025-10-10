import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import ForgotPassword from '../components/ForgotPassword'; // <-- NEW
import './Auth.css';

function AuthPage() {
  const location = useLocation();

  // Determine the default view (login by default)
  const [view, setView] = useState(location.state?.isLoginView ? 'login' : 'signup');

  // Keep view in sync with router state if it changes
  useEffect(() => {
    if (location.state?.isLoginView === true) setView('login');
    else if (location.state?.isLoginView === false) setView('signup');
  }, [location.state]);

  // Switch helpers
  const switchToSignup = () => setView('signup');
  const switchToLogin = () => setView('login');
  const switchToForgot = () => setView('forgot');

  return (
    <div className="auth-page-container">
      {/* Background animation */}
      <div className="bg-animation">
        {Array.from({ length: 256 }).map((_, i) => <span key={i}>*</span>)}
      </div>

      <div className="auth-wrapper">
        <div className="auth-container">
          {view === 'login' && (
            <LoginForm
              onSwitchToSignup={switchToSignup}
              onSwitchToForgot={switchToForgot} // <-- NEW
            />
          )}

          {view === 'signup' && (
            <SignUpForm onSwitchToLogin={switchToLogin} />
          )}

          {view === 'forgot' && (
            <ForgotPassword onBackToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
