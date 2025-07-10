import { Toast } from '@base-ui-components/react/toast'
import { useColorScheme, useCycleList } from '~/hooks'

function enableTransitions() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

export function ThemeToggleButton() {
  const [colorScheme, setColorScheme] = useColorScheme()
  const { next } = useCycleList(['light', 'dark', 'auto'] as const, {
    initialValue: colorScheme,
  })

  const { add } = Toast.useToastManager()

  useEffect(() => {
    if (enableTransitions()) {
      document.startViewTransition!(async () => {
        const colorSchemeMeta = document.head.querySelector(
          "meta[name='color-scheme']",
        )
        if (colorSchemeMeta) {
          colorSchemeMeta.setAttribute(
            'content',
            colorScheme === 'auto' ? 'dark light' : colorScheme,
          )
        }

        document.documentElement.setAttribute('data-theme', colorScheme)

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, 0)
        })
      })
    } else {
      const colorSchemeMeta = document.head.querySelector(
        "meta[name='color-scheme']",
      )

      if (colorSchemeMeta) {
        colorSchemeMeta.setAttribute(
          'content',
          colorScheme === 'auto' ? 'dark light' : colorScheme,
        )
      }

      document.documentElement.setAttribute('data-theme', colorScheme)
    }
  }, [colorScheme])

  return (
    <button
      className="btn select-none"
      onClick={() => {
        const nextTheme = next()
        setColorScheme(nextTheme)
        add({
          title: 'Theme changed',
          description: `Theme changed to ${nextTheme}`,
          priority: 'low',
        })
      }}
    >
      {colorScheme}
    </button>
  )
}
