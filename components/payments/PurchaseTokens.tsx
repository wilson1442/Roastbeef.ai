'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PurchaseTokens() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > 100) {
      toast.error('Quantity must be between 1 and 100');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Purchase Tokens</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">$2.99 per token</p>
        </div>
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-primary-600">
              ${(quantity * 2.99).toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Purchase ${quantity} Token(s)`}
        </button>
      </div>
    </div>
  );
}
