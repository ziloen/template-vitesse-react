import { useCallback, useRef, useState } from 'react'

/**
 * @example
 * ```tsx
 * const [state, setState, getState] = useGetState(0)
 *
 * function increment() {
 *  const current = getState() // 0
 *  setState(current + 1)
 *  const next = getState() // 1
 * }
 * ```
 */
export function useGetState<T>(initialState: T | (() => T)) {
  const [state, _setState] = useState<T>(initialState)
  const stateRef = useRef<T>(state)

  const getState = useCallback(() => stateRef.current, [])

  const setState = useCallback((value: T) => {
    stateRef.current = value
    _setState(value)
  }, [])

  return [state, setState, getState] as const
}
