import i18next from 'i18next'
import { Suspense } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import routes from '~react-pages'

i18next
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: {
      en: {
        translation: {
          loading: 'Loading...',
          placeholder: "What's your name?"
        }
      },
      zh_CN: {
        translation: {
          loading: '加载中...',
          placeholder: '你叫什么名字？'
        }
      }
    },

    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    }
  })

export default function App() {
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
  const { t } = useTranslation()

  return (
    <Suspense fallback={<p>{t('loading')}</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}
