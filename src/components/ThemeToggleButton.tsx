import { useColorScheme, useCycleList } from '~/hooks'

export function ThemeToggleButton() {
  const [colorScheme, setColorScheme] = useColorScheme()
  const { state, next } = useCycleList(['light', 'dark', 'auto'] as const, {
    initialValue: colorScheme,
  })

  useEffect(() => {
    document.documentElement.dataset.theme = state
  }, [colorScheme])

  return (
    <button
      className="btn"
      onClick={() => {
        setColorScheme(next())
      }}
    >
      {state}
    </button>
  )
}
