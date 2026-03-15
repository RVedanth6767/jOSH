import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'react-router-dom': '/src/router/react-router-dom.js',
    },
  },
});
