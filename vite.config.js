// vite.config.js  (or .ts)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';   // keep your other plugins
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),          // 🔑 enables Tailwind’s compiler inside Vite
  ],
});
