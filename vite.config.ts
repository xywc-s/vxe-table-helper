import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
  resolve: {
    alias: {
      '@/': 'src/'
    }
  },
  build: {
    outDir: 'es',
    minify: false,
    rollupOptions: {
      external: ['vue', '@vueuse/core', 'vxe-table', 'xe-utils', 'lodash-es', '@xywc-s/utils'],
      input: 'src/index.ts',
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          dir: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src'
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          dir: 'lib',
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ]
    },
    lib: {
      entry: 'src/index.ts',
      name: 'VxeTableHelper'
    }
  },
  plugins: [
    dts({
      root: '.',
      outputDir: ['es', 'lib'],
      include: ['src']
    })
  ]
})
