// main.jsx or main.tsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.legacy.jsx';
// import "./App.css"
import "./index.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<div className="p-8">Loading…</div>}>
    <App />
  </Suspense>
);
