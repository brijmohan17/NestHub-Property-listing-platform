import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing sign-in...');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setStatus('Sign-in failed');
      toast.error(decodeURIComponent(error));
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!token) {
      setStatus('Missing token');
      toast.error('OAuth sign-in failed');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const completeLogin = async () => {
      try {
        localStorage.setItem('token', token);
        const res = await apiFetch('/auth/me');
        if (!res.ok) throw new Error('Failed to load profile');
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Signed in successfully!');
        navigate('/', { replace: true });
      } catch {
        localStorage.removeItem('token');
        toast.error('Could not complete sign-in');
        navigate('/login', { replace: true });
      }
    };

    completeLogin();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff385c] mx-auto mb-4" />
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
