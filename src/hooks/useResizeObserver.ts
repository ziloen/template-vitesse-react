import { useMemoizedFn } from 'ahooks'
import type { BasicTarget } from 'ahooks/lib/utils/domTarget'
import { getTargetElement } from 'ahooks/lib/utils/domTarget'
import useEffectWithTarget from 'ahooks/lib/utils/useEffectWithTarget'

/**
 * ResizeObserver hook
 */
export function useResizeObserver(
  target: BasicTarget,
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions
) {
  const callbackFn = useMemoizedFn(callback)

  useEffectWithTarget(() => {
    const el = getTargetElement(target)
    if (!el) return

    const observer = new ResizeObserver(callbackFn)
    observer.observe(el, options)

    return () => observer.disconnect()
  }, [], target)
}