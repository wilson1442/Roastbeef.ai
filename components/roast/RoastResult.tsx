'use client';

import { useEffect, useState } from 'react';

interface RoastResultProps {
  roastId: string;
}

export default function RoastResult({ roastId }: RoastResultProps) {
  const [roast, setRoast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roastId) return;

    const fetchRoast = async () => {
      try {
        const response = await fetch(`/api/roast/status/${roastId}`);
        if (response.ok) {
          const data = await response.json();
          setRoast(data);

          // If still processing, poll for updates
          if (data.status === 'processing' || data.status === 'pending') {
            setTimeout(() => {
              fetchRoast();
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Error fetching roast:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoast();
    const interval = setInterval(fetchRoast, 5000);

    return () => clearInterval(interval);
  }, [roastId]);

  if (loading && !roast) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!roast) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-600">Status:</span>
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
        <div className="text-sm text-gray-600">
          <strong>URL:</strong> {roast.url}
        </div>
      </div>

      {roast.status === 'processing' || roast.status === 'pending' ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Roasting your website... This may take a moment.</p>
        </div>
      ) : roast.status === 'completed' && roast.result ? (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🥩 The Roast:</h3>
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg border-l-4 border-primary-500">
            <p className="text-gray-800 whitespace-pre-wrap">{roast.result}</p>
          </div>
        </div>
      ) : roast.status === 'failed' ? (
        <div className="text-center py-8">
          <p className="text-red-600">Failed to roast this website. Please try again.</p>
        </div>
      ) : null}
    </div>
  );
}
