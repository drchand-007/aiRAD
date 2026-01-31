// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from './firebase';

// // 1. Import the image
// import loginImage from './assets/medical_imaging.png';

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* 2. Image Column (hidden on mobile) */}
//       <div className="hidden md:block md:w-1/2 lg:w-3/5">
//         <img src={loginImage} alt="AI Radiology Interface" className="w-full h-full object-cover" />
//       </div>

//       {/* 3. Form Column */}
//       <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8">
//         <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//           <h1 className="text-3xl font-bold text-center text-gray-900">aiRAD</h1>
//           <p className="text-center text-gray-600 mb-6">AI-Assisted Radiology Reporting</p>
          
//           <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email Address"
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
//               required
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
//               required
//             />
//             <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
//               {isLogin ? 'Login' : 'Sign Up'}
//             </button>
//             {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
//           </form>

//           <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-center w-full text-sm text-indigo-600 hover:underline">
//             {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

// 2)


// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// // FIX: Reverting to './firebase' as standard module resolution should handle the extension
// import { auth, googleProvider } from './firebase';

// // Commenting out image import to prevent build errors if file is missing
// // import loginImage from './assets/medical_imaging.png'; 

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     try {
//       await signInWithPopup(auth, googleProvider);
//       // The onAuthStateChanged listener in your main App component will handle the redirect/state update automatically
//     } catch (err) {
//       console.error("Google Login Error:", err);
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* 2. Image Column (hidden on mobile) */}
//       <div className="hidden md:block md:w-1/2 lg:w-3/5 bg-blue-600 flex items-center justify-center">
//         {/* Replaced broken image import with a styled placeholder div */}
//         <div className="text-white text-center p-10">
//             <h2 className="text-4xl font-bold mb-4">AI-Assisted Radiology</h2>
//             <p className="text-xl">Streamline your reporting workflow with AI.</p>
//              {/* You can re-enable the image tag below once the file path is confirmed */}
//             {/* <img src={loginImage} alt="AI Radiology Interface" className="w-full h-full object-cover" /> */}
//         </div>
//       </div>

//       {/* 3. Form Column */}
//       <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8">
//         <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//           <h1 className="text-3xl font-bold text-center text-gray-900">aiRAD</h1>
//           <p className="text-center text-gray-600 mb-6">AI-Assisted Radiology Reporting</p>
          
//           <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email Address"
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
//               required
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
//               required
//             />
//             <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
//               {isLogin ? 'Login' : 'Sign Up'}
//             </button>
//           </form>

//           <div className="my-4 flex items-center">
//             <div className="flex-grow border-t border-gray-300"></div>
//             <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
//             <div className="flex-grow border-t border-gray-300"></div>
//           </div>

//           <button 
//             onClick={handleGoogleLogin}
//             type="button"
//             className="w-full bg-white text-gray-700 font-bold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center"
//           >
//             <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.66z.16-1.29z"/>
//                 <path fill="#EA4335" d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//             </svg>
//             Sign in with Google
//           </button>

//           {error && <p className="text-red-500 text-sm text-center pt-4">{error}</p>}

//           <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-center w-full text-sm text-indigo-600 hover:underline">
//             {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

//4)

// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
// // FIX: Reverting to './firebase' as standard module resolution should handle the extension
// import { auth, googleProvider } from './firebase';

// // Commenting out image import to prevent build errors if file is missing
// // import loginImage from './assets/medical_imaging.png'; 

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState(''); // For success messages (e.g., reset email sent)
//   const [isLogin, setIsLogin] = useState(true);
//   const [isReset, setIsReset] = useState(false); // New state for Reset Password view

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
    
//     try {
//       if (isReset) {
//         // Handle Password Reset
//         await sendPasswordResetEmail(auth, email);
//         setMessage('Password reset email sent! Check your inbox.');
//         // Optionally switch back to login after a delay or let user click back
//       } else if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     try {
//       await signInWithPopup(auth, googleProvider);
//     } catch (err) {
//       console.error("Google Login Error:", err);
//       setError(err.message);
//     }
//   };

//   // Toggle to Reset View
//   const toggleReset = () => {
//     setIsReset(true);
//     setError('');
//     setMessage('');
//   };

//   // Toggle back to Login View
//   const backToLogin = () => {
//     setIsReset(false);
//     setIsLogin(true);
//     setError('');
//     setMessage('');
//   };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-center bg-gray-100 relative"
//       style={{
//         // Medical themed background
//         backgroundImage: `url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Dark overlay for readability */}
//       <div className="absolute inset-0 bg-black/40 z-0"></div>

//       {/* Centered Card Container */}
//       <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl z-10 m-4">
//         <div className="text-center mb-8">
//            {/* App Logo or Icon could go here */}
//            {/* <div className="inline-block p-3 rounded-full bg-indigo-100 mb-4">
//              <svg className="w-8 h-8 text-indigo-600" ... />
//            </div> */}
//            <h1 className="text-3xl font-bold text-gray-900">aiRAD</h1>
//            <p className="text-gray-600 mt-2">AI-Assisted Radiology Reporting</p>
//         </div>
          
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//             {isReset ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create an Account')}
//           </h2>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email Address"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
//               required
//             />
            
//             {!isReset && (
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
//                 required
//               />
//             )}
            
//             <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition transform active:scale-95 duration-150 shadow-md">
//               {isReset ? 'Send Reset Link' : (isLogin ? 'Login' : 'Sign Up')}
//             </button>
//           </form>

//           {/* Success/Error Messages */}
//           {error && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 text-center">{error}</div>}
//           {message && <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 text-center font-medium">{message}</div>}

//           {/* Additional Options */}
//           <div className="mt-6 text-center space-y-3">
//             {!isReset && (
//               <>
//                 {isLogin && (
//                    <button 
//                      onClick={toggleReset} 
//                      className="text-sm text-gray-500 hover:text-indigo-600 hover:underline block w-full transition-colors"
//                    >
//                      Forgot Password?
//                    </button>
//                 )}
                
//                 <div className="my-4 flex items-center">
//                   <div className="flex-grow border-t border-gray-300"></div>
//                   <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
//                   <div className="flex-grow border-t border-gray-300"></div>
//                 </div>

//                 <button 
//                   onClick={handleGoogleLogin}
//                   type="button"
//                   className="w-full bg-white text-gray-700 font-bold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center shadow-sm transform active:scale-95 duration-150"
//                 >
//                   <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.66z.16-1.29z"/>
//                       <path fill="#EA4335" d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                   Sign in with Google
//                 </button>

//                 <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="text-sm text-indigo-600 hover:underline w-full mt-4 block transition-colors font-medium">
//                   {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
//                 </button>
//               </>
//             )}

//             {isReset && (
//               <button onClick={backToLogin} className="text-sm text-indigo-600 hover:underline block w-full transition-colors font-medium">
//                 Back to Login
//               </button>
//             )}
//           </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

//3)

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
// FIX: Reverting to './firebase' as standard module resolution should handle the extension
import { auth, googleProvider } from './firebase';

// Commenting out image import to prevent build errors if file is missing
import loginImage from './assets/medical_imaging.png'; 
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For success messages (e.g., reset email sent)
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false); // New state for Reset Password view
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    navigate('/app'); // <--- ENSURE THIS REDIRECTS TO /app
    try {
      if (isReset) {
        // Handle Password Reset
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent! Check your inbox.');
        // Optionally switch back to login after a delay or let user click back
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.message);
    }
  };

  // Toggle to Reset View
  const toggleReset = () => {
    setIsReset(true);
    setError('');
    setMessage('');
  };

  // Toggle back to Login View
  const backToLogin = () => {
    setIsReset(false);
    setIsLogin(true);
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex bg-gray-400">
       {/* 2. Image Column (hidden on mobile) */}
       <div className="hidden md:block md:w-1/2 lg:w-3/5">
        <img src={loginImage} alt="AI Radiology Interface" className="w-full h-full object-cover" />
       </div>

      {/* 3. Form Column */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900">aiRAD</h1>
          <p className="text-center text-gray-600 mb-6">AI-Assisted Radiology Reporting</p>
          
          <h2 className="text-2xl font-bold text-center mb-6">
            {isReset ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create an Account')}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            
            {!isReset && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            )}
            
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
              {isReset ? 'Send Reset Link' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {/* Success/Error Messages */}
          {error && <p className="text-red-500 text-sm text-center pt-4">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center pt-4 font-medium">{message}</p>}

          {/* Additional Options */}
          <div className="mt-6 text-center space-y-3">
            {!isReset && (
              <>
                {isLogin && (
                   <button 
                     onClick={toggleReset} 
                     className="text-sm text-gray-500 hover:text-indigo-600 hover:underline block w-full"
                   >
                     Forgot Password?
                   </button>
                )}
                
                <div className="my-4 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full bg-white text-gray-700 font-bold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.66z.16-1.29z"/>
                      <path fill="#EA4335" d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>

                <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="text-sm text-indigo-600 hover:underline w-full mt-4 block">
                  {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
                </button>
              </>
            )}

            {isReset && (
              <button onClick={backToLogin} className="text-sm text-indigo-600 hover:underline block w-full">
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;