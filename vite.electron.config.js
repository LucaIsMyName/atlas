// vite.electron.config.js
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    outDir: 'dist/main',
    lib: {
      entry: path.resolve(__dirname, 'src/main/main.js'),
      formats: ['cjs'],
      fileName: () => '[name].js',
    },
    rollupOptions: {
      external: ['electron', 'path', 'fs/promises', 'electron-is-dev', 'electron-acrylic-window'],
      input: {
        main: path.join(__dirname, 'src/main/main.js'),
        preload: path.join(__dirname, 'src/main/preload.js')
      },
      output: {
        format: 'cjs',
        entryFileNames: '[name].js',
        dir: 'dist/main'
      }
    },
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});