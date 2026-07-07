import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import FAB from '../components/FAB';
import BackToTop from '../components/BackToTop';
import ThemeToggle from '../components/ThemeToggle';

const MainLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Loader />
      {!isDashboardRoute && <Navbar />}
      {!isDashboardRoute && <ThemeToggle floating />}
      <main id="main-content" className="min-h-screen focus:outline-none" tabIndex="-1">
        {children}
      </main>
      {!isDashboardRoute && <Footer />}
      {!isDashboardRoute && <FAB />}
      {!isDashboardRoute && <BackToTop />}
    </>
  );
};

export default MainLayout;
