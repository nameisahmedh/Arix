import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CreditCard, Check } from 'lucide-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const TestPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { getToken } = useAuth();

  const handleTestPayment = async () => {
    setIsProcessing(true);
    
    try {
      const token = await getToken();
      const { data } = await axios.post(
        '/api/payment/test-payment',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Test payment processed! You now have Premium access.');
      } else {
        toast.error(data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <CreditCard className="w-12 h-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Test Payment</h2>
        <p className="text-gray-600 text-sm">
          Simulate a premium subscription payment
        </p>
      </div>

      <button
        onClick={handleTestPayment}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Process Test Payment
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> This is a test payment simulation. 
          After clicking, you'll have Premium access to generate images.
        </p>
      </div>
    </div>
  );
};

export default TestPayment;