import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      include: [
        /\/src\/.*\.(vue|jsx|tsx|js|ts)$/, // 明确扫描 src 目录下的所有相关文件
        /\.vue$/,
        /\.vue\?vue/,
        /\.[tj]sx?$/,
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          // 自动导入 CSS
          importStyle: 'sass',
        })
      ],
      include: [
        /\/src\/.*\.(vue|jsx|tsx|js|ts)$/, // 明确扫描 src 目录下的所有相关文件
        /\.vue$/,
        /\.vue\?vue/,
        /\.[tj]sx?$/,
      ],
      // 可选：如果组件在 src/components 外，需指定额外目录
      dirs: ['src/components', 'src/views', 'src/views/Order'], // 根据你的项目结构调整
      dts: 'src/components.d.ts', // 强制生成声明文件
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 9999
  },
})
