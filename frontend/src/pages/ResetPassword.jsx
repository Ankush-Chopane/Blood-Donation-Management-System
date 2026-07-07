import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock, FaKey } from 'react-icons/fa';
import api from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password: data.password });
      if (res.data.success) {
        toast.success('Password updated successfully! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
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
          <h2 className="font-heading text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-lightGray/50 text-sm mt-1">Enter your new secure password details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-xs font-semibold text-white uppercase tracking-wider" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaLock /></span>
              <input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                className={`w-full py-3.5 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.95rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
                  errors.password ? 'border-primary' : 'border-glass-border'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
            </div>
            {errors.password && <span className="text-secondary text-xs">{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-xs font-semibold text-white uppercase tracking-wider" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaLock /></span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className={`w-full py-3.5 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.95rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
                  errors.confirmPassword ? 'border-primary' : 'border-glass-border'
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
              />
            </div>
            {errors.confirmPassword && <span className="text-secondary text-xs">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(239,35,60,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Resetting Password...' : <><FaKey /> Reset Password</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
