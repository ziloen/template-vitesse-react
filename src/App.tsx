import { Toast } from '@base-ui-components/react/toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { RouteObject } from 'react-router'
import { createBrowserRouter, RouterProvider } from 'react-router'
import CarbonClose from '~icons/carbon/close'
import routes from '~react-pages'

function flatRoutes(routes: RouteObject[], parentPath: string = ''): string[] {
  return routes.flatMap((route) => {
    if (typeof route.path !== 'string') return []
    const path = parentPath ? `${parentPath}/${route.path}` : route.path

    return route.children ? flatRoutes(route.children, path) : path
  })
}

i18next.use(initReactI18next).init({
  lng: 'en',

  react: {
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'b'],
  },

  interpolation: {
    /** global variables */
    defaultVariables: {
      APP_NAME: 'Vite React Template',
    },
  },

  parseMissingKeyHandler(key, defaultValue) {
    return key
  },

  // debug: IS_DEV,
})

const queryClient = new QueryClient()

const router = createBrowserRouter(routes, { basename: '' })

export default function App() {
  useEffect(() => {
    const lang = 'en'
    import(`~/locales/${lang}.json`).then((resource) => {
      i18next.addResourceBundle(lang, 'translation', resource)
      i18next.changeLanguage(lang)
    })
  }, [])

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

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="bg-surface relative z-[calc(1000-var(--toast-index))] rounded-lg p-4"
    >
      <Toast.Title className="m-0" />
      <Toast.Description className="m-0" />

      <Toast.Close className="absolute end-2 top-2 size-5">
        <CarbonClose width={16} height={16} />
      </Toast.Close>
    </Toast.Root>
  ))
}
