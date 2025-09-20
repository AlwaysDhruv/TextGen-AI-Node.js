import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div>
      <NavigationBar />
      <main>
        {/* React Router will render the correct page here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;