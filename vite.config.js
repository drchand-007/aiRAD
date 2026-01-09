// // vite.config.js  (or .ts)
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';   // keep your other plugins
// import tailwindcss from '@tailwindcss/vite';
// import basicSsl from '@vitejs/plugin-basic-ssl'; // 1. Import the SSL plugin

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),          // 🔑 enables Tailwind’s compiler inside Vite
//     basicSsl() // 2. Add the SSL plugin here
//   ],
//   server: {
//     host: true, // 3. Exposes the server to your local network (required for mobile testing)
//   },
//   define: {
//     // This is required to polyfill the 'global' object.
//     global: {},
//     // This is required to polyfill the 'process' object.
//     'process.env': {}
//   },
//   resolve: {
//     alias: {
//       // This maps the Node.js built-in modules to their browser-friendly polyfills.
//       events: 'events',
//       stream: 'stream-browserify',
//       util: 'util',
//       buffer: 'buffer',
//     },
//   },
// });

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
    VitePWA({
      
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'aiRAD Radiology Reporter',
        short_name: 'aiRAD',
        description: 'AI-Powered Radiology Reporting Tool',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        //  ADDED THIS LINE HERE to fix the 2MB limit error
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        
        // Cache Google Fonts and other static assets
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
  },
  define: {
    global: {},
    'process.env': {}
  },
  resolve: {
    alias: {
      events: 'events',
      stream: 'stream-browserify',
      util: 'util',
      buffer: 'buffer',
    },
  },
});