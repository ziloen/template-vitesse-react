import './styles/main.css'
import './styles/tailwind.css'

import { Toast } from '@base-ui-components/react/toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { scan } from 'react-scan'
import CarbonClose from '~icons/carbon/close'

// if (import.meta.env.DEV) {
//   scan({ enabled: true, animationSpeed: 'off', log: false, _debug: false })
// }

const queryClient = new QueryClient()

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

export function Layout({ children }: { children: React.ReactNode }) {
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
          <html data-theme="auto">
            <head>
              <meta charSet="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <link
                rel="icon"
                href="/favicon.svg"
                type="image/svg+xml"
                media="(prefers-color-scheme: light)"
              />
              <link
                rel="icon"
                href="/favicon-dark.svg"
                type="image/svg+xml"
                media="(prefers-color-scheme: dark)"
              />

              <title>Vite React</title>
              <meta name="description" content="Vite React Template" />

              {/* Disable Chromium auto translate */}
              <meta name="google" content="notranslate" />

              {/* Dark color scheme */}
              <meta name="color-scheme" content="dark light" />

              <Meta />
              <Links />
            </head>

            <body>
              {children}
              <Toast.Portal>
                <Toast.Viewport className="fixed top-auto right-4 bottom-4">
                  <ToastList />
                </Toast.Viewport>
              </Toast.Portal>
              <ScrollRestoration />
              <Scripts />
            </body>
          </html>
        </Toast.Provider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return <p>Loading...</p>
}

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="relative z-[calc(1000-var(--toast-index))] rounded-lg bg-surface p-4"
    >
      <Toast.Title className="m-0" />
      <Toast.Description className="m-0" />

      <Toast.Close className="absolute end-2 top-2 size-5">
        <CarbonClose width={16} height={16} />
      </Toast.Close>
    </Toast.Root>
  ))
}
