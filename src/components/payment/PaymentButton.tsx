'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CreditCard, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface PaymentButtonProps {
  invoiceId: string;
  amount: number;
  onSuccess?: () => void;
}

export function PaymentButton({ invoiceId, amount, onSuccess }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    }
  }, [searchParams, onSuccess]);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create payment');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      console.error('Payment error:', err);
      setIsLoading(false);
    }
  };

  const paymentStatus = searchParams.get('payment');

  if (paymentStatus === 'success') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Payment Successful!</span>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'cancelled') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-orange-600">
          <XCircle className="h-5 w-5" />
          <span className="font-medium">Payment Cancelled</span>
        </div>
        <Button
          onClick={handlePayment}
          className="w-full"
          size="lg"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Redirecting to payment...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
