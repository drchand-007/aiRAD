import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.legacy.jsx';
// import "./App.css"
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<div className="p-8">Loading…</div>}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </Suspense>
);
