/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import path from 'node:path'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import PostcssPresetEnv from 'postcss-preset-env'


export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },

  plugins: [
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    react(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        { 'usehooks-ts': ['useCounter', 'useDarkMode'] }
      ],
      dts: true
    })
  ],

  css: {
    postcss: {
      plugins: [PostcssPresetEnv({ stage: 2 })]
    }
  },

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom'
  }
})
