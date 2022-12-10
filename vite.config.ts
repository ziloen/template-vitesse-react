/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import PostcssPresetEnv from 'postcss-preset-env'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'


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
        {
          react: [
            'useState',
            'useEffect',
            'useMemo',
            'useLayoutEffect',
            'useCallback',
            'useRef',
            'forwardRef',
            'useImperativeHandle',
            'Suspense'
          ]
        },
        { 'react-router-dom': ['useNavigate', 'useParams', 'useRoutes'] },
        { 'usehooks-ts': ['useCounter', 'useDarkMode'] },
        { 'framer-motion': ['motion', 'AnimatePresence'] }
      ],
      dts: './src/types/auto-imports.d.ts'
    })

    // Auto import react component?
  ],

  css: {
    postcss: {
      plugins: [PostcssPresetEnv({ stage: 0 })]
    }
  },

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom'
  }
})
