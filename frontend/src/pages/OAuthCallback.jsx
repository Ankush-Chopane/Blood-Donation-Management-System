import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google sign-in failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    if (!token) {
      toast.error('Authentication failed — no token received.');
      navigate('/login', { replace: true });
      return;
    }

    loginWithToken(token).then((result) => {
      if (result.success) {
        toast.success('Signed in with Google! 🎉');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.error || 'Authentication failed.');
        navigate('/login', { replace: true });
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darkBg text-lightGray gap-5">
      {/* Animated spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-secondary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="font-heading text-white text-lg font-semibold">Signing you in...</p>
      <p className="text-lightGray/40 text-sm font-body">Please wait a moment</p>
    </div>
  );
};

export default OAuthCallback;
