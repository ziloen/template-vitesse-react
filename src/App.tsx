import i18next from 'i18next'
import { Suspense } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { useI18n } from '~/hooks'
import routes from '~react-pages'

i18next
  .use(initReactI18next)
  .init({
    lng: 'en',

    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },

    interpolation: {
      /** global variables */
      defaultVariables: {
        APP_NAME: 'Vite React Template'
      },
    },

    // debug: IS_DEV,
  })

export default function App() {
  useEffect(() => {
    (async () => {
      const lang = 'en'
      const resource = await import(`~/locales/${lang}.json`) as Record<string, any>
      i18next.addResourceBundle(lang, 'translation', resource)
      i18next.changeLanguage(lang)
    })()
  }, [])

  return (
    <I18nextProvider i18n={i18next}>
      <main className="font-sans px-4 py-10 text-center text-gray-700 dark:text-gray-200">
        <Router>
          <Routes />
        </Router>
      </main>
    </I18nextProvider>
  )
}

function Routes() {
  const { t } = useI18n()

  return (
    <Suspense fallback={<p>{t('loading')}</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}
