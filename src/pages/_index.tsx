import { Counter } from '~/components/Counter'
import { ThemeToggleButton } from '~/components/ThemeToggleButton'
import { useI18n } from '~/hooks'

export default function Index() {
  const name = useRef<HTMLInputElement>(null)
  const { t, i18n } = useI18n()
  const navigate = useNavigate()

  function go() {
    if (name.current) {
      navigate(`/hi/${encodeURIComponent(name.current.value)}`, {
        state: {
          from: '/',
        },
      })
    }
  }

  return (
    <div className="flex flex-col items-center">
      <em className="text-sm opacity-75">Vite Starter Template</em>

      <Counter />

      <ThemeToggleButton />

      <input
        ref={name}
        placeholder={t('placeholder')}
        type="text"
        className="border-neutral-primary w-[250px] rounded border bg-transparent px-4 py-2 text-center outline-none active:outline-none"
        onKeyDown={({ key }) => key === 'Enter' && go()}
      />

      <div>
        <button className="btn m-3 text-sm" disabled={!name} onClick={go}>
          Go
        </button>
      </div>

      <div>
        {t('useI18nTest', {
          link: <a className="text-info-primary" />,
          name: <span className="text-success-primary">Dynamic Content</span>,
        })}
      </div>

      <div>
        {t('_examples.listInterpolation', {
          list: ['CN', 'FR', 'RU', 'GB', 'US'],
        })}
      </div>
    </div>
  )
}
