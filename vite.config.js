import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    watch: {
      ignored: ['**/public/assets/*.pdf', '**/assets/*.pdf', '**/*.pdf']
    }
  }
});
