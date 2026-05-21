import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../public',   // собираем прямо в папку public бэкенда
    emptyOutDir: true,
  },
});