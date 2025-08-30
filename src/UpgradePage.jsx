// src/components/UpgradePage.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react';

const UpgradePage = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Add the Razorpay script to the head
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4242/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can pass more details if needed, e.g., plan details
        body: JSON.stringify({ userId: user.uid }), 
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const order = await response.json();

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // IMPORTANT: Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'aiRAD Professional',
        description: 'Annual Subscription',
        order_id: order.id,
        handler: async function (response) {
            // Send the payment details to your backend for verification
            const verificationResponse = await fetch('http://localhost:4242/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user.uid, // Send user ID for role update
                }),
            });

            const result = await verificationResponse.json();
            if (result.status === 'success') {
                alert('Payment Successful! Your account has been upgraded.');
                // Reload the page to reflect the new role
                window.location.reload();
            } else {
                alert('Payment verification failed. Please contact support.');
            }
        },
        prefill: {
          name: user.displayName || 'Radiology Professional',
          email: user.email,
        },
        notes: {
            userId: user.uid,
        },
        theme: {
          color: '#0052cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
            alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Could not initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
        {/* Left Side: Features */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <h2 className="text-3xl font-bold mb-2">aiRAD Professional</h2>
          <p className="text-gray-300 mb-8">Unlock the full potential of AI-assisted reporting.</p>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="text-green-400 w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Unlimited AI Analysis</h3>
                <p className="text-gray-400 text-sm">Analyze unlimited radiology images with our advanced AI models.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-400 w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Advanced Reporting Tools</h3>
                <p className="text-gray-400 text-sm">Access all templates, voice macros, and AI-powered suggestions.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-400 w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Cloud Storage</h3>
                <p className="text-gray-400 text-sm">Securely save and access all your generated reports from anywhere.</p>
              </div>
            </li>
             <li className="flex items-start">
              <CheckCircle className="text-green-400 w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Priority Support</h3>
                <p className="text-gray-400 text-sm">Get dedicated assistance from our expert team whenever you need it.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Side: Payment */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Get Started Today</h3>
            <div className="text-center mb-6">
                <p className="text-gray-600">Annual Subscription</p>
                <p className="text-5xl font-extrabold text-gray-900">₹5000<span className="text-xl font-medium text-gray-500">/year</span></p>
                <p className="text-sm text-gray-500 mt-1">Billed annually. Cancel anytime.</p>
            </div>
            
            <button 
                onClick={handlePayment} 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5 mr-2" />
                        Upgrade to Professional
                    </>
                )}
            </button>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-green-600"/> Secure payments powered by
                </p>
                <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6 mx-auto mt-2"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
