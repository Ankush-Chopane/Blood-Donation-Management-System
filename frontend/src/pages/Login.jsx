import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSignInAlt, FaFlask } from 'react-icons/fa';

const DEMO_EMAIL = 'demo@bloodconnect.com';
const DEMO_PASSWORD = 'Demo@1234';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);

    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    // Fill fields visually so user sees what's happening
    setValue('email', DEMO_EMAIL);
    setValue('password', DEMO_PASSWORD);

    const result = await login(DEMO_EMAIL, DEMO_PASSWORD);
    setDemoLoading(false);

    if (result.success) {
      toast.success('Welcome! You are now in the demo account 🎉');
      navigate('/dashboard');
    } else {
      toast.error('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-12 px-6 bg-darkBg text-lightGray relative">
      <div className="absolute w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-3xl -top-12 -left-12 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-3xl -bottom-12 -right-12 pointer-events-none" />

      <div className="w-full max-w-[420px] rounded-2xl bg-darkGray/45 border border-glass-border p-8 shadow-glass backdrop-blur relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl mb-2 hover:scale-105 transition-transform">❤️</Link>
          <h2 className="font-heading text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-lightGray/50 text-sm mt-1">Sign in to coordinate emergency matching.</p>
        </div>

        {/* Demo Login Button */}
        <button
          id="demo-login-btn"
          type="button"
          onClick={handleDemoLogin}
          disabled={demoLoading || loading}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 mb-4 rounded-xl font-body font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60 border border-dashed border-amber-400/50 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:border-amber-400/80 hover:shadow-[0_0_18px_rgba(251,191,36,0.15)]"
        >
          {demoLoading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin" />
              Entering demo…
            </>
          ) : (
            <>
              <FaFlask className="text-amber-300" />
              Try Demo Account
            </>
          )}
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-glass-border" />
          <span className="text-lightGray/30 text-xs font-body uppercase tracking-widest">or sign in</span>
          <div className="flex-1 h-px bg-glass-border" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-heading text-xs font-semibold text-white uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaEnvelope /></span>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                className={`w-full py-3.5 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.95rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
                  errors.email ? 'border-primary' : 'border-glass-border'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && <span className="text-secondary text-xs mt-1">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-heading text-xs font-semibold text-white uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaLock /></span>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className={`w-full py-3.5 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.95rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
                  errors.password ? 'border-primary' : 'border-glass-border'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
            </div>
            {errors.password && <span className="text-secondary text-xs mt-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(239,35,60,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Signing in...' : <><FaSignInAlt /> Sign In</>}
          </button>
        </form>

        <div className="text-center mt-4 text-xs font-body">
          <Link to="/forgot-password" className="text-lightGray/45 hover:text-secondary transition-colors">
            Forgot Password?
          </Link>
        </div>

        <div className="text-center mt-6 text-sm text-lightGray/50 font-body">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary hover:text-white font-semibold transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
