/**
 * Waits for the next tick (useEffect) to execute a callback.
 *
 * @example
 * ```tsx
 * const nextTick = useNextTick()
 *
 * async function onClick() {
 *   setEditing(true)
 *   nextTick(() => {
 *     inputRef.current?.focus()
 *   })
 *   // or
 *   await nextTick()
 *   inputRef.current?.focus()
 * }
 * ```
 */
export function useNextTick() {
  const callbacks = useRef<(() => void)[]>([])

  useEffect(() => {
    if (!callbacks.current.length) return
    for (const cb of callbacks.current) {
      cb()
    }
    callbacks.current = []
  })

  return useCallback((callback?: () => void) => {
    callback && callbacks.current.push(callback)
    return new Promise<void>((resolve) => callbacks.current.push(resolve))
  }, [])
}
