'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function TokenDisplay() {
  const { data: session } = useSession();
  const [tokens, setTokens] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTokens();
    }
  }, [session]);

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/tokens/check');
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-accent-400 to-blue-400 text-white px-6 py-3 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🪙</span>
        <div>
          <div className="text-sm opacity-90">Tokens</div>
          <div className="text-2xl font-bold">
            {loading ? '...' : tokens !== null ? tokens : '...'}
          </div>
        </div>
      </div>
    </div>
  );
}
