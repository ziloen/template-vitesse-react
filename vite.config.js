/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { Features } from 'lightningcss'
import { resolve as r } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import unpluginIcons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'
import Pages from 'vite-plugin-pages'

export default defineConfig(({ command, mode }) => {
  const cwd = process.cwd()
  const env = loadEnv(mode, cwd)

  const IS_PROD = env.PROD
  const IS_DEV = env.DEV
  const IS_BUILD = command === 'build'

  return {
    resolve: {
      alias: {
        '~': r('src'),
        '~cwd': cwd,
      },
    },

    define: {
      IS_BUILD,
      IS_DEV,
      IS_PROD,
    },

    plugins: [
      // https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react
      react(),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages(),

      // https://github.com/unplugin/unplugin-auto-import
      AutoImport({
        imports: [
          {
            react: [
              'Fragment',
              'Suspense',
              'useCallback',
              'useEffect',
              'useId',
              'useImperativeHandle',
              'useInsertionEffect',
              'useLayoutEffect',
              'useMemo',
              'useRef',
              'useState',
              'useSyncExternalStore',
            ],
            'react-dom': ['createPortal'],
            'react-router-dom': ['useNavigate', 'useParams', 'useRoutes'],
            'motion/react': ['motion', 'AnimatePresence'],
            clsx: ['clsx'],
            'clsx/lite': [['clsx', 'clsxLite']],
          },
          {
            type: true,
            from: 'react',
            imports: ['ReactNode', 'ComponentProps'],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
      }),

      // https://github.com/Jevon617/unplugin-svg-component
      // unplugin-svg-component infinitely watch reload on dev and throws error on build
      // UnpluginSvgComponent({
      //   iconDir: r('src/assets/svg-icons'),
      //   dts: true,
      //   dtsDir: r('src/types'),
      //   componentStyle: 'width: 1em; height: 1em;',
      //   projectType: 'react',
      // }),

      // https://github.com/unplugin/unplugin-icons
      unpluginIcons({
        compiler: 'jsx',
        jsx: 'react',
        scale: 1,
      }),

      tailwindcss(),

      // polyfills
      // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
      legacy({
        // render legacy chunks for non-modern browsers
        renderLegacyChunks: false,
        /** polyfills for non-modern browsers (not supports esm) */
        // polyfills: [],
        /** polyfills for modern browsers (supports esm) */
        modernPolyfills: [
          // Proposals
          /** Array.fromAsync() */
          'esnext.array.from-async',
          /** Promise.withResolvers() */
          'esnext.promise.with-resolvers',
          /** https://github.com/tc39/proposal-set-methods */
          'proposals/set-methods',
          /** https://github.com/tc39/proposal-iterator-helpers */
          'proposals/iterator-helpers',
          /** https://github.com/tc39/proposal-async-iterator-helpers */
          'proposals/async-iterator-helpers',

          // Web APIs
          /** structuredClone() */
          'web.structured-clone',
          /** URL.canParse() */
          'web.url.can-parse',
          /** URL.parse() */
          'web.url.parse',

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
        ],
      }),
    ],

    build: {
      // disable inline base64
      assetsInlineLimit: 0,
      cssMinify: 'esbuild',
    },

    css: {
      transformer: 'lightningcss',
      lightningcss: {
        // https://lightningcss.dev/transpilation.html#feature-flags
        include: Features.Colors | Features.Nesting | Features.MediaRangeSyntax,
        exclude: Features.LogicalProperties,

        cssModules: {
          generateScopedName: '[hash:base64:8]',
        },
      },
      devSourcemap: true,
      modules: {
        generateScopedName: '[hash:base64:8]',
      },
    },

    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },
  }
})
