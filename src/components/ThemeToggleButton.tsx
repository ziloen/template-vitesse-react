import { useColorScheme, useCycleList } from '~/hooks'

function enableTransitions() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

export function ThemeToggleButton() {
  const [colorScheme, setColorScheme] = useColorScheme()
  const { state, next } = useCycleList(['light', 'dark', 'auto'] as const, {
    initialValue: colorScheme,
  })

  useEffect(() => {
    if (enableTransitions()) {
      document.startViewTransition!(async () => {
        const colorScheme = document.head.querySelector(
          "meta[name='color-scheme']"
        )
        if (colorScheme) {
          colorScheme.setAttribute(
            'content',
            state === 'auto' ? 'dark light' : state
          )
        }

        document.documentElement.setAttribute('data-theme', state)

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, 0)
        })
      })
    } else {
      const colorScheme = document.head.querySelector(
        "meta[name='color-scheme']"
      )

      if (colorScheme) {
        colorScheme.setAttribute(
          'content',
          state === 'auto' ? 'dark light' : state
        )
      }

      document.documentElement.setAttribute('data-theme', state)
    }
  }, [colorScheme])

  return (
    <button
      className="btn select-none"
      onClick={() => {
        setColorScheme(next())
      }}
    >
      {state}
    </button>
  )
}
