// vite.config.js  (or .ts)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';   // keep your other plugins
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl'; // 1. Import the SSL plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),          // 🔑 enables Tailwind’s compiler inside Vite
    basicSsl() // 2. Add the SSL plugin here
  ],
  server: {
    host: true, // 3. Exposes the server to your local network (required for mobile testing)
  },
  define: {
    // This is required to polyfill the 'global' object.
    global: {},
    // This is required to polyfill the 'process' object.
    'process.env': {}
  },
  resolve: {
    alias: {
      // This maps the Node.js built-in modules to their browser-friendly polyfills.
      events: 'events',
      stream: 'stream-browserify',
      util: 'util',
      buffer: 'buffer',
    },
  },
});
