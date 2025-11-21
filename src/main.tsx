import './styles/main.css'
import './styles/tailwind.css'

import { Toast } from '@base-ui-components/react/toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { isNotNil } from 'es-toolkit'
import i18next from 'i18next'
import { createRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { LoaderFunction, RouteObject } from 'react-router'
import { createBrowserRouter, RouterProvider } from 'react-router'
import enJson from '~/locales/en.json'
import CarbonClose from '~icons/carbon/close'

const queryClient = new QueryClient()

function HydrateFallback() {
  return null
}

const routes = Object.entries(
  import.meta.glob<{
    default: React.ComponentType
    loader?: LoaderFunction
    HydrateFallback?: React.ComponentType
    ErrorBoundary?: React.ComponentType
  }>('./pages/**/*.tsx'),
)
  .map<RouteObject | null>(([path, request]) => {
    const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1]

    if (!fileName) {
      return null
    }

    const index = fileName.endsWith('_index')

    const normalizedPath = fileName
      .replaceAll('_index', '')
      .replaceAll(/\$$/g, '*')
      .replaceAll('$', ':')
      .replaceAll('.', '/')

    return {
      index: index,
      path: normalizedPath,
      HydrateFallback: HydrateFallback,
      lazy: async () => {
        const value = await request()

        return {
          Component: value.default,
          HydrateFallback: value.HydrateFallback ?? null,
          loader: value.loader,
        }
      },
    }
  })
  .filter(isNotNil)

const router = createBrowserRouter(routes, { basename: '' })

i18next.use(initReactI18next).init({
  lng: 'en',

  resources: {
    en: { translation: enJson },
  },

  react: {
    // Only work when using `<Trans>` component
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'b'],
  },

  interpolation: {
    /** global variables */
    defaultVariables: {
      APP_NAME: 'Vite React Template',
    },
    // TODO: support default tags
    // defaultTags: {
    //   notranslate({ key, content, children }): string {
    //     return children
    //   },
    // },
  },

  parseMissingKeyHandler(key, defaultValue) {
    return key
  },
})

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="relative z-[calc(1000-var(--toast-index))] rounded-lg bg-surface-secondary p-4"
    >
      <Toast.Title className="m-0" />
      <Toast.Description className="m-0" />

      <Toast.Close className="absolute end-2 top-2 flex-center bg-transparent p-1">
        <CarbonClose width={16} height={16} />
      </Toast.Close>
    </Toast.Root>
  ))
}

function App() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    if (i18next.hasResourceBundle(lang, 'translation')) {
      return
    }

    let cancelled = false

    import(`~/locales/${lang}.json`).then((resource) => {
      if (cancelled) {
        return
      }
      i18next.addResourceBundle(lang, 'translation', resource)
      i18next.changeLanguage(lang)
    })

    return () => {
      cancelled = true
    }
  }, [lang])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <Toast.Provider>
          <RouterProvider router={router} />

          <Toast.Portal>
            <Toast.Viewport className="fixed top-auto right-4 bottom-4">
              <ToastList />
            </Toast.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

createRoot(document.querySelector('#root')!).render(<App />)
