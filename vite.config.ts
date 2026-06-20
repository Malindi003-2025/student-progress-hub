import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/start-plugin-vercel'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tanstackStart(), 
    viteReact()
  ],
}
