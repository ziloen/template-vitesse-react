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
    <div className="grid h-full content-start justify-items-center overflow-y-auto">
      <div className="flex w-full justify-between px-2 py-2">
        <div></div>
        <ThemeToggleButton />
      </div>

      <em className="text-sm opacity-75">Vite Starter Template</em>

      <Counter />

      <input
        name="name"
        ref={name}
        placeholder={t('placeholder')}
        type="text"
        className="w-[250px] rounded border border-neutral-primary bg-transparent px-4 py-2 text-center outline-none active:outline-none"
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

      <div>{t('_examples.notranslate')}</div>
      <div>
        {t('_examples.nestedTags', {
          b: <strong />,
          i: <i />,
        })}
      </div>
      <div>
        {t('_examples.multipleSameTags', {
          b: <strong />,
        })}
      </div>

      <div>
        {t('_examples.tagAndVariable', {
          b: <strong />,
          name: <span>{i18n.language}</span>,
        })}
      </div>
    </div>
  )
}
