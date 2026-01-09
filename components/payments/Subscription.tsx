'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function Subscription() {
  const { data: session } = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'active' | 'cancelled'>('none');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      checkSubscription();
    }
  }, [session]);

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.subscriptionStatus || 'none');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create subscription');
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      toast.success('Subscription will be cancelled at the end of the billing period');
      setSubscriptionStatus('cancelled');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Monthly Subscription</h3>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-accent-100 to-blue-100 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">$5.00</div>
            <div className="text-sm text-gray-600">per month</div>
            <div className="mt-2 text-sm font-semibold text-gray-800">5 tokens per month</div>
          </div>
        </div>
        {subscriptionStatus === 'none' && (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-accent-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </button>
        )}
        {subscriptionStatus === 'active' && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Cancel Subscription'}
          </button>
        )}
        {subscriptionStatus === 'cancelled' && (
          <p className="text-sm text-gray-600 text-center">
            Your subscription will be cancelled at the end of the billing period.
          </p>
        )}
      </div>
    </div>
  );
}
