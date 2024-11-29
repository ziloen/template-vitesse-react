import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAsyncEffect } from 'ahooks'
import i18next from 'i18next'
import { Suspense } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { RouteObject } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { useI18n } from '~/hooks'
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
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
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

export default function App() {
  useAsyncEffect(async () => {
    const lang = 'en'
    const resource = (await import(`~/locales/${lang}.json`)) as Record<
      string,
      any
    >
    i18next.addResourceBundle(lang, 'translation', resource)
    i18next.changeLanguage(lang)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <Router basename="">
          <Routes />
        </Router>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

function Routes() {
  const { t } = useI18n()

  return (
    <Suspense fallback={<p>{t('loading')}</p>}>{useRoutes(routes)}</Suspense>
  )
}
