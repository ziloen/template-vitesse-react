import { useAsyncEffect } from 'ahooks'
import { App as AntApp } from 'antd'
import i18next from 'i18next'
import { Suspense } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { useI18n } from '~/hooks'
import routes from '~react-pages'

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

  // debug: IS_DEV,
})

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
    <I18nextProvider i18n={i18next}>
      <AntApp component={false}>
        <Router basename="">
          <Routes />
        </Router>
      </AntApp>
    </I18nextProvider>
  )
}

function Routes() {
  const { t } = useI18n()

  return (
    <Suspense fallback={<p>{t('loading')}</p>}>{useRoutes(routes)}</Suspense>
  )
}
