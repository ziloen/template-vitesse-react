// https://vueuse.org/core/useElementBounding/
import { useEventListener, useLatest, useMemoizedFn } from 'ahooks'
import { getTargetElement } from 'ahooks/lib/utils/domTarget'
import useEffectWithTarget from 'ahooks/lib/utils/useEffectWithTarget'
import { useResizeObserver } from './useResizeObserver'

type UseElementBoundingOptions = {
  /**
   * Reset values to 0 on component unmounted
   *
   * @default true
   */
  reset?: boolean

  /**
   * Immediately call update on component mounted
   *
   * @default true
   */
  immediate?: boolean
}

export function useElementBounding(
  target: React.RefObject<HTMLElement | null>,
  options: UseElementBoundingOptions = {}
) {
  const optionsRef = useLatest(options)

  const [rect, setRect] = useState<DOMRect>(() => new DOMRect())

  const update = useMemoizedFn(() => {
    const el = getTargetElement(target)
    if (!el) {
      if (optionsRef.current.reset) {
        setRect(new DOMRect())
      }

      return
    }

    const rect = el.getBoundingClientRect()

    setRect(rect)
  })

  useResizeObserver(target, update)

  useEventListener('scroll', update)

  useEventListener('resize', update)

  useEffectWithTarget(
    () => {
      if (optionsRef.current.immediate) update()
    },
    [],
    target
  )

  return rect
}
