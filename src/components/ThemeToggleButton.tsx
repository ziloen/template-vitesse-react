import { Toast } from '@base-ui-components/react/toast'
import { useColorScheme } from '~/hooks'
import CarbonMoon from '~icons/carbon/moon'
import CarbonSun from '~icons/carbon/sun'

export function ThemeToggleButton() {
  const [colorScheme, setColorScheme] = useColorScheme()

  const { add } = Toast.useToastManager()

  const computedTheme = useMemo(() => {
    if (colorScheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    } else {
      return colorScheme
    }
  }, [colorScheme])

  return (
    <button
      className="flex-center rounded-full bg-surface-secondary p-1 select-none"
      onClick={(e) => {
        const nextTheme = computedTheme === 'light' ? 'dark' : 'light'
        transitionTheme(() => {
          setColorScheme(nextTheme)
          const colorSchemeMeta = document.head.querySelector(
            "meta[name='color-scheme']",
          )

          if (colorSchemeMeta) {
            colorSchemeMeta.setAttribute('content', nextTheme)
          }

          document.documentElement.setAttribute('data-theme', nextTheme)
        }, e.nativeEvent)
        // add({
        //   title: 'Theme changed',
        //   description: `Theme changed to ${nextTheme}`,
        //   priority: 'low',
        // })
      }}
    >
      {computedTheme === 'light' ? (
        <CarbonMoon width={24} height={24} />
      ) : (
        <CarbonSun width={24} height={24} />
      )}
    </button>
  )
}

function enableTransitions() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

function transitionTheme(fn: () => void, e: MouseEvent) {
  if (enableTransitions()) {
    const transition = document.startViewTransition!(async () => {
      fn()

      document.documentElement.style.setProperty('--mouse-x', `${e.x}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.y}px`)

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 0)
      })
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          '--view-transition-progress': ['0%', '100%'],
        },
        {
          duration: 1_000,
          easing: 'ease-in-out',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  } else {
    fn()
  }
}
