'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentForm } from './PaymentForm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string | null;
  amount: number;
  currency?: string;
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  clientSecret,
  amount,
  currency = 'USD',
  orderId,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSuccess = () => {
    setPaymentSuccess(true);
    onSuccess?.();
  };

  const handleError = (error: string) => {
    onError?.(error);
  };

  // Close modal when opened externally
  useEffect(() => {
    if (!isOpen) {
      setPaymentSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format amount for display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
          <p className="text-sm text-gray-500 mt-1">
            Order #{orderId.slice(0, 8)}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-500">
                Your payment of {formattedAmount} has been processed.
              </p>
            </div>
          ) : clientSecret ? (
            <div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formattedAmount}
                </p>
              </div>

              <PaymentForm
                clientSecret={clientSecret}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-500">Loading payment...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!paymentSuccess && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {paymentSuccess && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}