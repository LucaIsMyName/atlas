// scripts/build-main.js
import { mkdir, cp } from 'fs/promises';
import { join } from 'path';

async function buildMain() {
  try {
    // Create dist/main directory
    await mkdir('dist/main', { recursive: true });
    
    // Copy main process files
    await cp('src/main', 'dist/main', { recursive: true });
    
    console.log('Main process files copied successfully');
  } catch (error) {
    console.error('Error building main process:', error);
    process.exit(1);
  }
}

buildMain();