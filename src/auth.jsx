import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';

// 1. Import the image
import loginImage from './assets/medical_imaging.png';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 2. Image Column (hidden on mobile) */}
      <div className="hidden md:block md:w-1/2 lg:w-3/5">
        <img src={loginImage} alt="AI Radiology Interface" className="w-full h-full object-cover" />
      </div>

      {/* 3. Form Column */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900">aiRAD</h1>
          <p className="text-center text-gray-600 mb-6">AI-Assisted Radiology Reporting</p>
          
          <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-center w-full text-sm text-indigo-600 hover:underline">
            {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;