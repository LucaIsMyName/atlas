import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    outDir: 'dist/main',
    lib: {
      entry: path.resolve(__dirname, 'src/main/main.cjs'),
      formats: ['cjs'],
      fileName: () => 'main.cjs'
    },
    rollupOptions: {
      external: ['electron', 'path', 'fs/promises', 'electron-acrylic-window', 'dotenv'],
      output: {
        format: 'cjs',
        entryFileNames: '[name].cjs',
        dir: 'dist/main'
      }
    },
    emptyOutDir: false
  }
});