import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import api from '../services/api';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: data.email });
      if (res.data.success) {
        toast.success('Password reset link sent to your email!');
        reset();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-12 px-6 bg-darkBg text-lightGray relative">
      <div className="absolute w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-3xl -top-12 -left-12 pointer-events-none" />
      
      <div className="w-full max-w-[420px] rounded-2xl bg-darkGray/45 border border-glass-border p-8 shadow-glass backdrop-blur relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl mb-2 hover:scale-105 transition-transform">❤️</Link>
          <h2 className="font-heading text-2xl font-bold text-white">Forgot Password</h2>
          <p className="text-lightGray/50 text-sm mt-1">Enter your email and we'll send a recovery link.</p>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(239,35,60,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Sending Request...' : <><FaPaperPlane /> Request Reset Link</>}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-lightGray/50 font-body">
          Remembered your password?{' '}
          <Link to="/login" className="text-secondary hover:text-white font-semibold transition-colors">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
