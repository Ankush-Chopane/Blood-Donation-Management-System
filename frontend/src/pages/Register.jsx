import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser(data.name, data.email, data.password, data.role);
    setLoading(false);

    if (result.success) {
      toast.success('Registered successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-12 px-6 bg-darkBg text-lightGray relative">
      <div className="absolute w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-3xl -top-12 -left-12 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-3xl -bottom-12 -right-12 pointer-events-none" />

      <div className="w-full max-w-[440px] rounded-2xl bg-darkGray/45 border border-glass-border p-8 shadow-glass backdrop-blur relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl mb-2 hover:scale-105 transition-transform">❤️</Link>
          <h2 className="font-heading text-2xl font-bold text-white">Join BloodConnect</h2>
          <p className="text-lightGray/50 text-sm mt-1">Register to connect with donors in your area.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[0.7rem] font-semibold text-white uppercase tracking-wider" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaUser /></span>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className={`w-full py-3 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.92rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
                  errors.name ? 'border-primary' : 'border-glass-border'
                }`}
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            {errors.name && <span className="text-secondary text-xs">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[0.7rem] font-semibold text-white uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaEnvelope /></span>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                className={`w-full py-3 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.92rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
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
            {errors.email && <span className="text-secondary text-xs">{errors.email.message}</span>}
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[0.7rem] font-semibold text-white uppercase tracking-wider" htmlFor="role">
              Account Role
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaUserTag /></span>
              <select
                id="role"
                className="w-full py-3 pl-11 pr-4 bg-[#151622] border border-glass-border rounded-xl text-white font-body text-[0.92rem] outline-none transition-all focus:border-secondary focus:bg-[#151622] focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] appearance-none cursor-pointer"
                {...register('role', { required: 'Role is required' })}
              >
                <option value="donor">Donor (Can register donation history)</option>
                <option value="recipient">Recipient (Needs emergency blood)</option>
                <option value="bank">Blood Bank (Manages repository inventory)</option>
                <option value="admin">Administrator (System Overlord)</option>
              </select>
            </div>
            {errors.role && <span className="text-secondary text-xs">{errors.role.message}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-heading text-[0.7rem] font-semibold text-white uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaLock /></span>
              <input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                className={`w-full py-3 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.92rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
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
            <label className="font-heading text-[0.7rem] font-semibold text-white uppercase tracking-wider" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lightGray/40"><FaLock /></span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className={`w-full py-3 pl-11 pr-4 bg-white/2 border rounded-xl text-white font-body text-[0.92rem] outline-none transition-all focus:border-secondary focus:bg-white/5 focus:shadow-[0_0_15px_rgba(239,35,60,0.15)] ${
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
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(239,35,60,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
          >
            {loading ? 'Creating Account...' : <><FaUserPlus /> Register</>}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-lightGray/50 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:text-white font-semibold transition-colors">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
