import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 项目页可在构建时设置：VITE_BASE=/你的仓库名/ npm run build
  base: process.env.VITE_BASE || './',
});
