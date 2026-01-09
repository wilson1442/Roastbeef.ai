'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UrlForm from '@/components/roast/UrlForm';
import RoastResult from '@/components/roast/RoastResult';
import TokenDisplay from '@/components/tokens/TokenDisplay';
import { useEffect } from 'react';

export default function RoastPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roastId, setRoastId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !session?.user?.emailVerified) {
      router.push('/login');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session || !session.user.emailVerified) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            🥩 Roast a Website
          </h1>
          <p className="text-gray-600 mb-6">
            Enter a website URL and let our AI roast it for you!
          </p>
          <div className="flex justify-center mb-8">
            <TokenDisplay />
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-8 rounded-lg shadow-lg mb-8">
          <UrlForm onSuccess={(id) => setRoastId(id)} />
        </div>

        {roastId && (
          <div className="mt-8">
            <RoastResult roastId={roastId} />
          </div>
        )}
      </div>
    </div>
  );
}
