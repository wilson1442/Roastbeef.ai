'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RoastHistory() {
  const [roasts, setRoasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/roast/history');
      if (response.ok) {
        const data = await response.json();
        setRoasts(data.roasts || []);
      }
    } catch (error) {
      console.error('Error fetching roast history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (roasts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-600">No roasts yet. Start roasting some websites!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Roast History</h2>
      <div className="space-y-3">
        {roasts.map((roast) => (
          <Link
            key={roast.id}
            href={`/roast/${roast.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 truncate">{roast.url}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(roast.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  roast.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : roast.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {roast.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
