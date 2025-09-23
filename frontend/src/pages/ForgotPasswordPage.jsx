import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import Layout from '../components/Layout';

const ForgotPasswordPage = () => {
  return (
    <Layout>
      <div className="auth-page">
        <ForgotPasswordForm />
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
