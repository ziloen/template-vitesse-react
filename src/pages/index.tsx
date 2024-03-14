import { Counter } from '~/components/Counter'
import { useI18n } from '~/hooks'
import SvgIcon from '~virtual/svg-component'

export default function Index() {
  const name = useRef<HTMLInputElement>(null)
  const { t } = useI18n()

  const navigate = useNavigate()
  function go() {
    if (name.current)
      navigate(`/hi/${encodeURIComponent(name.current.value)}`)
  }

  return (
    <div className='flex flex-col items-center'>
      <SvgIcon name="favicon" className="text-blue text-50px" />

      <p>
        <a rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank">
          Vitesse Lite
        </a>
      </p>
      <p>
        <em className="text-sm op75">Opinionated Vite Starter Template</em>
      </p>

      <div className="py-4" />

      <Counter />

      <input
        ref={name}
        placeholder={t('placeholder')}
        type="text"
        className="px-4 py-2 w-250px text-center bg-transparent outline-none active:outline-none border rounded border-gray-200 dark:border-gray-700"
        onKeyDown={({ key }) => key === 'Enter' && go()}
      />

      <div>
        <button
          className="m-3 text-sm btn"
          disabled={!name}
          onClick={go}
        >
          Go
        </button>
      </div>

      <div>
        {t('useI18nTest', {
          link: <a className='text-blue-400' />,
          name: <span className='text-green-500'>Dynamic Content</span>
        })}
      </div>
    </div>
  )
}
