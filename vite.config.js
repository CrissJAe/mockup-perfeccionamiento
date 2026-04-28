import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const REPO_NAME = 'mockup-perfeccionamiento' 

export default defineConfig({
  plugins: [react()],
  base: `/${REPO_NAME}/`,
})