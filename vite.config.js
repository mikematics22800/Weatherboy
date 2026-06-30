import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['umbrella.png'],
      workbox: {
        globIgnores: ['**/cesium/**'],
      },
      manifest: {
        name: 'Weatherboy',
        short_name: 'Weatherboy',
        description: 'A weather app with forecast and map views.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/Weatherboy/',
        scope: '/Weatherboy/',
        icons: [
          {
            src: 'umbrella.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'umbrella.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: "/Weatherboy/"
})
