import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wgslVitePlugin } from '@vgpu/wgsl/loader-vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/prism-portfolio/' : '/',
  plugins: [react(), wgslVitePlugin()],
});
