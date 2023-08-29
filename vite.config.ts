/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import { resolve as r } from 'node:path'
import PostcssPresetEnv from 'postcss-preset-env'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'


export default defineConfig(({ command, mode }) => {
  const IS_PROD = process.env.NODE_ENV === 'production'
  const IS_DEV = process.env.NODE_ENV === 'development'
  const IS_BUILD = command === 'build'

  return {
    resolve: {
      alias: {
        '~': r('src'),
        '~cwd': process.cwd(),
      }
    },

    define: {
      IS_BUILD,
      IS_DEV,
      IS_PROD,
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
            ],
            'react-router-dom': ['useNavigate', 'useParams', 'useRoutes'],
            'framer-motion': ['motion', 'AnimatePresence'],
            'react-i18next': ['useTranslation'],
            clsx: ['clsx']
          },
        ],
        dts: 'src/types/auto-imports.d.ts'
      }),

      // Auto import react component?

      legacy({
      // render legacy chunks for non-modern browsers
        renderLegacyChunks: false,
        /** polyfills for non-modern browsers (not supports esm) */
        // polyfills: [],
        /** polyfills for modern browsers (supports esm) */
        modernPolyfills: [
        // Web APIs
        /** structuredClone() */
          'web.structured-clone',
          /** URL.canParse() */
          'web.url.can-parse',

          // ES2023
          /** Array.prototype.findLast() */
          'es.array.find-last',
          /** Array.prototype.findLastIndex() */
          'es.array.find-last-index',
          /** TypedArray.prototype.findLast() */
          'es.typed-array.find-last',
          /** TypedArray.prototype.findLastIndex() */
          'es.typed-array.find-last-index',
          /** Array.prototype.toReversed() */
          'esnext.array.to-reversed',
          /** Array.prototype.toSorted() */
          'esnext.array.to-sorted',
          /** Array.prototype.toSpliced() */
          'esnext.array.to-spliced',
          /** Array.prototype.with() */
          'esnext.array.with',

          // ES2022
          /** Array.prototype.at() */
          'es.array.at',
          /** String.prototype.at() */
          'es.string.at-alternative',
          /** TypedArray.prototype.at() */
          'es.typed-array.at',
          /** Object.hasOwn */
          'es.object.has-own',
          /** AggregateError */
          'es.aggregate-error',
          /** AggregateError: cause */
          'es.aggregate-error.cause',
          /** Error: cause */
          'es.error.cause',
        ]
      })
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
  }
})
