import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// Use local source in dev, npm package in production
const localSrc = path.resolve(__dirname, '../src/index.ts')
const localCss = path.resolve(__dirname, '../src/gooey-toast.css')
const useLocalSource = fs.existsSync(localSrc)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      ...(useLocalSource
        ? {
            'goey-toast-vue/styles.css': localCss,
            'goey-toast-vue': localSrc,
          }
        : {}),
      vue: path.resolve(__dirname, 'node_modules/vue'),
      motion: path.resolve(__dirname, 'node_modules/motion'),
    },
  },
})
