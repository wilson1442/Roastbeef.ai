'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import PurchaseTokens from '@/components/payments/PurchaseTokens';
import Subscription from '@/components/payments/Subscription';
import TokenDisplay from '@/components/tokens/TokenDisplay';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');
    const tokens = searchParams.get('tokens');

    if (payment === 'success' && tokens) {
      toast.success(`Successfully purchased ${tokens} token(s)!`);
    } else if (payment === 'cancelled') {
      toast.error('Payment was cancelled');
    }

    const subscription = searchParams.get('subscription');
    if (subscription === 'success') {
      toast.success('Subscription activated successfully!');
    } else if (subscription === 'cancelled') {
      toast.error('Subscription was cancelled');
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Pricing
          </h1>
          <p className="text-lg text-gray-600">
            Choose the plan that works for you
          </p>
        </div>

        {session && (
          <div className="flex justify-center mb-8">
            <TokenDisplay />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <PurchaseTokens />
          <Subscription />
        </div>

        <div className="bg-gradient-to-r from-accent-100 to-blue-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Free Plan</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ 5 free tokens when you sign up</li>
            <li>✅ 1 free token every month</li>
            <li>✅ No credit card required</li>
            <li>✅ Full access to all features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
