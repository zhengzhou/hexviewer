import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/components/**/*'],
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/HexViewer.jsx'),
      name: 'HexViewer',
      fileName: (format) => `hex-viewer.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {
        // 在UMD构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // 配置类型定义文件输出
        assetFileNames: 'assets/[name][extname]'
      }
    },
    // 确保类型定义文件被正确输出
    emptyOutDir: true
  }
})