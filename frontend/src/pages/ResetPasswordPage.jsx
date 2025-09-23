import React from 'react';
import ResetPasswordForm from '../components/ResetPasswordForm';
import Layout from '../components/Layout';

const ResetPasswordPage = () => {
  return (
    <Layout>
      <div className="auth-page">
        <ResetPasswordForm />
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
