'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        toast.success('Email verified successfully!');
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Verification failed');
        toast.error(error.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        {status === 'verifying' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        )}
        {status === 'success' && (
          <div className="text-4xl mb-4">✅</div>
        )}
        {status === 'error' && (
          <div className="text-4xl mb-4">❌</div>
        )}
        <p className="text-lg font-semibold text-gray-800">{message}</p>
      </div>
    </div>
  );
}
