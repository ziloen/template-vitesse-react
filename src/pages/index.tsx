import { Counter } from '~/components/Counter'
import { ThemeToggleButton } from '~/components/ThemeToggleButton'
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
      <em className="op75 text-sm">Vite Starter Template</em>

      <Counter />

      <ThemeToggleButton />

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
          link: <a className="text-blue-500 dark:text-blue-400" />,
          name: (
            <span className="text-green-700 dark:text-green-500">
              Dynamic Content
            </span>
          ),
        })}
      </div>
    </div>
  )
}
