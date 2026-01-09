'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface UrlFormProps {
  onSuccess: (roastId: string) => void;
}

export default function UrlForm({ onSuccess }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/roast/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit roast');
      }

      toast.success('Roast submitted successfully!');
      setUrl('');
      onSuccess(data.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit roast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          Website URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !url}
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Roasting...' : '🥩 Roast This Website!'}
      </button>
    </form>
  );
}
