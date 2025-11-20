import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This allows the code to use process.env.API_KEY even in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});