import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHeart, FiLogIn, FiMenu, FiUserPlus, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
  { name: 'Donate', path: '/#donate' },
  { name: 'Request Blood', path: '/#request' },
  { name: 'Blood Banks', path: '/#blood-banks' },
  { name: 'Contact', path: '/#contact' }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleLinkClick = (event, path) => {
    if (!path.startsWith('/#')) return;

    event.preventDefault();
    const targetElement = document.getElementById(path.substring(2));

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', path);
    }
  };

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) return location.hash === path.substring(1);
    return location.pathname === path;
  };

  return (
    <header className="relative z-[999]">
      <nav
        aria-label="Primary navigation"
        className={`fixed left-1/2 flex w-[calc(100%-32px)] max-w-[1200px] -translate-x-1/2 items-center justify-between border border-glass-border bg-darkSurface/75 shadow-glass backdrop-blur-[18px] transition-all duration-300 ${
          scrolled
            ? 'top-0 max-w-full rounded-none border-x-0 border-t-0 px-5 py-3 md:px-10'
            : 'top-5 rounded-2xl px-5 py-4 md:px-8'
        }`}
      >
        <Link to="/" className="flex min-w-0 items-center gap-2.5 group" aria-label="BloodConnect home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <FiHeart aria-hidden="true" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-lightGray md:text-xl">
            Blood<span className="text-secondary">Connect</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.path}
                onClick={(event) => handleLinkClick(event, link.path)}
                aria-current={isActiveLink(link.path) ? 'page' : undefined}
                className={`relative py-2 text-sm font-semibold text-lightGray/78 hover:text-lightGray ${
                  isActiveLink(link.path) ? 'text-lightGray after:w-full' : 'after:w-0'
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-secondary after:transition-all`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="rounded-xl border border-glass-border px-4 py-2 text-sm font-semibold text-lightGray hover:border-glass-border-hover">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-glass-border px-4 py-2 text-sm font-semibold text-lightGray hover:border-glass-border-hover">
                <FiLogIn aria-hidden="true" /> Login
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-primary">
                <FiUserPlus aria-hidden="true" /> Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-glass-border text-lightGray md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        <div
          id="mobile-navigation"
          className={`fixed right-4 top-20 w-[min(320px,calc(100vw-32px))] rounded-2xl border border-glass-border bg-darkSurface/95 p-5 shadow-premium backdrop-blur-xl transition-all duration-300 md:hidden ${
            mobileMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  onClick={(event) => handleLinkClick(event, link.path)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActiveLink(link.path) ? 'bg-white/[0.08] text-lightGray' : 'text-lightGray/78 hover:bg-white/5 hover:text-lightGray'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid gap-3 border-t border-glass-border pt-4">
            {user ? (
              <>
                <Link to="/dashboard" className="rounded-xl border border-glass-border px-4 py-3 text-center text-sm font-semibold text-lightGray">
                  Dashboard
                </Link>
                <button type="button" onClick={logout} className="rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-xl border border-glass-border px-4 py-3 text-center text-sm font-semibold text-lightGray">
                  Login
                </Link>
                <Link to="/register" className="rounded-xl bg-secondary px-4 py-3 text-center text-sm font-bold text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
