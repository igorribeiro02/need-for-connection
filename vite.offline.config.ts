import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Gera UM arquivo HTML com tudo dentro (código, estilos e fontes), que abre com duplo clique, sem internet e sem servidor.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-offline', assetsInlineLimit: 100_000_000, emptyOutDir: true },
})
