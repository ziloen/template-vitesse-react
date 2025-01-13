// https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useMemoizedFn/index.ts
import { useRef } from 'react'

export function useMemoizedFn<T extends (this: any, ...args: any[]) => any>(
  fn: T
): T {
  const fnRef = useRef<T>(fn)
  const memoizedFn = useRef<T | undefined>(undefined)

  fnRef.current = fn

  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fnRef.current.apply(this, args)
    } as T
  }

  return memoizedFn.current
}
