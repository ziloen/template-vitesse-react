import { Toast } from '@base-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mapKeys } from 'es-toolkit'
import i18next from 'i18next'
import type { ComponentType } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { LoaderFunction, RouteObject } from 'react-router'
import { createBrowserRouter, RouterProvider } from 'react-router'
import type { LiteralUnion } from 'type-fest'
import enJson from '~/locales/en.json'
import CarbonClose from '~icons/carbon/close'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

function HydrateFallback() {
  return null
}

export const routes = Object.entries(
  import.meta.glob<{
    default: ComponentType
    loader?: LoaderFunction
    handle?: unknown
    HydrateFallback?: ComponentType
    ErrorBoundary?: ComponentType
  }>('./**/*.tsx', { base: './pages' }),
).map<RouteObject>(([path, request]) => {
  // `./concerts.$id.tsx` -> `concerts.$id`
  const filePath = path.slice(2, -4)

  const index = filePath.endsWith('_index')

  // https://reactrouter.com/how-to/file-route-conventions#file-route-conventions
  const normalizedPath = filePath
    // Index Route: `_index.tsx` -> `/`
    .replaceAll('_index', '')
    // Catch-all Route: `$.tsx` -> `*`
    .replaceAll(/\$$/g, '*')
    // Optional Segments: `($lang).$id.tsx` -> `:lang?/:id`, `item.(edit).tsx` -> `item/edit?`
    .replaceAll(/\(([^).]+)\)/g, '$1?')
    // Dynamic Segments: `item.$id.tsx` -> `item/:id`
    .replaceAll('$', ':')
    // Nested Route: `concerts.trending.tsx` -> `concerts/trending`
    .replaceAll('.', '/')

  return {
    index: index,
    path: normalizedPath,
    HydrateFallback,
    lazy: async () => {
      const route = await request()

      return {
        loader: route.loader,
        handle: route.handle,
        Component: route.default,
        // FIXME: HydrateFallback is not working in lazy routes
        HydrateFallback: route.HydrateFallback ?? null,
        ErrorBoundary: route.ErrorBoundary ?? null,
      }
    },
  }
})

export const router = createBrowserRouter(routes, { basename: '' })

const i18nResourcesMap = mapKeys(
  import.meta.glob<string>(['./*.json', '!./*-tpl.json'], {
    base: './locales',
    import: 'default',
    query: '?url',
    eager: true,
  }),
  (v, k) => k.slice(2, -5),
)

export const supportedLngs = Object.keys(i18nResourcesMap)

const fallbackLng: Record<
  LiteralUnion<'default', string>,
  [string, ...string[]]
> = {
  zh: ['zh-Hans'],
  'zh-CN': ['zh-Hans'],
  'zh-SG': ['zh-Hans'],

  'zh-TW': ['zh-Hant'],
  'zh-HK': ['zh-Hant'],

  default: ['en'],
}

i18next.use(initReactI18next).init({
  lng: 'en',
  supportedLngs,
  fallbackLng,

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

function resolveLanguage(lng: string) {
  if (supportedLngs.includes(lng)) {
    return lng
  }

  if (fallbackLng[lng]) {
    return fallbackLng[lng][0]
  }

  const lngCode = lng.split(/-_/)[0]!

  if (supportedLngs.includes(lngCode)) {
    return lngCode
  }

  if (fallbackLng[lngCode]) {
    return fallbackLng[lngCode][0]
  }

  const similarLng = supportedLngs.find((l) => l.startsWith(lngCode))

  if (similarLng) {
    return similarLng
  }

  return fallbackLng.default[0]
}

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

export default function App() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const resolvedLang = resolveLanguage(lang)

    if (i18next.hasResourceBundle(resolvedLang, 'translation')) {
      return
    }

    let cancelled = false

    fetch(i18nResourcesMap[resolvedLang]!)
      .then((res) => res.json())
      .then((resource) => {
        i18next.addResourceBundle(resolvedLang, 'translation', resource)

        if (cancelled) return

        i18next.changeLanguage(resolvedLang)
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
