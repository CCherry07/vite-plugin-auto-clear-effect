import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginAutoClear from './src/plugin/'
export default defineConfig({
  plugins: [VitePluginAutoClear(), vue()],
})
