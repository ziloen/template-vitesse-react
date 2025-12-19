import { Combobox } from '@base-ui/react'
import { Temporal } from 'temporal-polyfill'
import { Counter } from '~/components/Counter'
import { ThemeToggleButton } from '~/components/ThemeToggleButton'
import {
  getLanguageDisplayName,
  listFormat,
  supportedLngs,
  useI18n,
} from '~/i18n'

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
      <div className="flex w-full items-center justify-end gap-2 px-2 py-2">
        <span>{Temporal.Instant.from(APP_BUILD_TIME).toLocaleString()}</span>
        <span className="opacity-50">{APP_BUILD_COMMIT}</span>
        <LanguageSelect />
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
        <button className="m-3 btn text-sm" disabled={!name} onClick={go}>
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
          list: listFormat(['CN', 'FR', 'RU', 'GB', 'US'], i18n.language),
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

function LanguageSelect() {
  const { i18n, changeLanguage, fetchingLanguage } = useI18n()

  const languageItems = useMemo(() => {
    return supportedLngs.map((l) => (
      <Combobox.Item key={l} value={l} className="flex justify-between gap-2">
        <span>{getLanguageDisplayName(l, i18n.language)}</span>
        <span>{getLanguageDisplayName(l, l)}</span>
      </Combobox.Item>
    ))
  }, [i18n.language])

  return (
    <Combobox.Root
      items={supportedLngs}
      value={i18n.language}
      onValueChange={(value) => {
        if (!value) return
        changeLanguage(value)
      }}
    >
      <Combobox.Trigger className="btn">
        {!!fetchingLanguage && <span>Loading...</span>}
        <Combobox.Value>
          {(v: string) => getLanguageDisplayName(v, i18n.language)}
        </Combobox.Value>
        <Combobox.Icon />
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup className="border bg-surface-primary px-1 py-2">
            <Combobox.List>{languageItems}</Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
