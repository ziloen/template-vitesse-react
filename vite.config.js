/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-oxc'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { Features } from 'lightningcss'
import { execSync } from 'node:child_process'
import { resolve as r } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import unpluginIcons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const cwd = process.cwd()
  const env = loadEnv(mode, cwd)

  const IS_PROD = env.PROD
  const IS_DEV = env.DEV
  const IS_BUILD = command === 'build'

  const target = '> 0.5%, last 2 versions, Firefox ESR, not dead'

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
      APP_BUILD_TIME: JSON.stringify(new Date().toISOString()),
      APP_BUILD_COMMIT: JSON.stringify(getCommitHash()),
    },

    plugins: [
      // https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react
      react(),

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
            'react-router': ['useNavigate', 'useParams', 'useRoutes'],
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
        targets: target,
        modernTargets: target,
        modernPolyfills: true,
      }),
    ],

    build: {
      // disable inline base64
      assetsInlineLimit: 0,
      cssMinify: 'lightningcss',
      target: browserslistToEsbuild(target),
      reportCompressedSize: false,
      minify: 'oxc',
      rollupOptions: {
        output: {
          hashCharacters: 'hex',
        },
      },
    },

    css: {
      transformer: 'lightningcss',
      lightningcss: {
        // https://lightningcss.dev/transpilation.html#feature-flags
        // Always transpile
        include: Features.Colors | Features.Nesting | Features.MediaRangeSyntax,

        // Never transpile
        exclude: Features.LogicalProperties,
      },
      devSourcemap: true,
      modules: {
        generateScopedName: '[hash:hex:8]',
      },
    },

    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },

    experimental: {
      // renderBuiltUrl
      enableNativePlugin: true,
    },
  }
})

function getCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    }).trim()
  } catch (error) {
    console.error('Failed to get commit hash:', error)
    return ''
  }
}
