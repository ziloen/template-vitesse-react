import { Counter } from '~/components/Counter'
import { useI18n } from '~/hooks'

export default function Index() {
  const name = useRef<HTMLInputElement>(null)
  const { t } = useI18n()

  const navigate = useNavigate()
  function go() {
    if (name.current) navigate(`/hi/${encodeURIComponent(name.current.value)}`)
  }

  return (
    <div className="flex flex-col items-center">
      <p>
        <a rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank">
          Vitesse Lite
        </a>
      </p>
      <p>
        <em className="op75 text-sm">Opinionated Vite Starter Template</em>
      </p>

      <div className="py-4" />

      <Counter />

      <input
        ref={name}
        placeholder={t('placeholder')}
        type="text"
        className="w-250px rounded border border-gray-200 bg-transparent px-4 py-2 text-center outline-none active:outline-none dark:border-gray-700"
        onKeyDown={({ key }) => key === 'Enter' && go()}
      />

      <div>
        <button className="btn m-3 text-sm" disabled={!name} onClick={go}>
          Go
        </button>
      </div>

      <div>
        {t('useI18nTest', {
          link: <a className="text-blue-400" />,
          name: <span className="text-green-500">Dynamic Content</span>,
        })}
      </div>
    </div>
  )
}
