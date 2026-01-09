'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RoastResult from '@/components/roast/RoastResult';

export default function RoastDetailPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const roastId = params?.id as string;

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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Roast Details</h1>
        {roastId && <RoastResult roastId={roastId} />}
      </div>
    </div>
  );
}
