'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TokenDisplay from '@/components/tokens/TokenDisplay';
import RoastHistory from '@/components/roast/RoastHistory';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {session.user.email}!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <TokenDisplay />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/roast"
                className="block w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-semibold text-center hover:from-primary-600 hover:to-secondary-600 transition-all"
              >
                🥩 Start Roasting
              </Link>
              <Link
                href="/pricing"
                className="block w-full bg-white text-primary-600 border-2 border-primary-500 py-3 rounded-lg font-semibold text-center hover:bg-primary-50 transition-all"
              >
                💳 Buy Tokens
              </Link>
            </div>
          </div>
        </div>

        <RoastHistory />
      </div>
    </div>
  );
}
