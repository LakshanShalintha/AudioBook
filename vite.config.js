import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split dependencies from node_modules into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor'; // Creates a vendor.js chunk
          }
          // Split pdfjs-dist into its own chunk
          if (id.includes('pdfjs-dist')) {
            return 'pdfjs';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
});
