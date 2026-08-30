import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: true,
    watch: {
      ignored: ['**/public/assets/*.pdf', '**/assets/*.pdf', '**/*.pdf']
    }
  }
});
