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
        document.documentElement.dataset.theme = state

        await new Promise<void>(resolve => {
          setTimeout(() => {
            resolve()
          }, 0)
        })
      })
    } else {
      document.documentElement.dataset.theme = state
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
