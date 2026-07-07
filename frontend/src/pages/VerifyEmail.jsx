import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaExclamationTriangle, FaHourglassHalf } from 'react-icons/fa';
import api from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email token...');

  useEffect(() => {
    const triggerVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing in url parameters.');
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        if (res.data.success) {
          setStatus('success');
          setMessage('Your account email has been verified successfully!');
          toast.success('Verified successfully!');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Invalid or expired email verification token.');
      }
    };

    triggerVerification();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-12 px-6 bg-darkBg text-lightGray relative">
      <div className="absolute w-[300px] h-[300px] bg-secondary/5 rounded-full filter blur-3xl -top-12 -left-12 pointer-events-none" />

      <div className="w-full max-w-[420px] rounded-2xl bg-darkGray/45 border border-glass-border p-8 shadow-glass backdrop-blur text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="mb-6 hover:scale-105 transition-transform inline-block text-3xl">❤️</div>

        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <FaHourglassHalf className="text-secondary text-5xl animate-spin filter drop-shadow-[0_0_10px_rgba(239,35,60,0.4)]" />
            <h2 className="font-heading text-xl font-bold text-white">Verifying Account</h2>
            <p className="text-lightGray/60 text-sm leading-relaxed">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <FaCheckCircle className="text-emerald-400 text-5xl filter drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
            <h2 className="font-heading text-xl font-bold text-white">Verification Complete</h2>
            <p className="text-lightGray/60 text-sm leading-relaxed">{message}</p>
            <Link to="/login" className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(239,35,60,0.4)] mt-4">
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <FaExclamationTriangle className="text-primary text-5xl filter drop-shadow-[0_0_10px_rgba(217,4,41,0.4)]" />
            <h2 className="font-heading text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-lightGray/60 text-sm leading-relaxed">{message}</p>
            <Link to="/" className="w-full py-3 border border-glass-border bg-darkGray/30 text-white font-body font-bold rounded-xl transition-all hover:border-glass-border-hover mt-4">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
