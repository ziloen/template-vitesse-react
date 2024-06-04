import { useMemoizedFn } from 'ahooks'
import type { Observable } from 'rxjs'

/**
 *
 * @example
 * ```ts
 * ```
 */
export function useSubscribe<T>(
  observable: Observable<T>,
  subscriber: (value: T) => void
) {
  const fnRef = useMemoizedFn(subscriber)

  useEffect(() => {
    const sub = observable.subscribe(fnRef)
    return () => sub.unsubscribe()
  }, [observable])
}
