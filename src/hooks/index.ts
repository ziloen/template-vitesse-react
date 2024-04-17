export * from './useColorScheme'
export * from './useCycleList'
export * from './useElementBounding'
export * from './useI18n'
export * from './useMagicKeys'
export * from './useNextTick'

/**
 * @example
 * ```tsx
 * const ref1 = useRef(null)
 * const ref2 = useRef(null)
 * const ref3 = useRef(null)
 * 
 * <div ref={mergeRefs(ref1, ref2, ref3)} />
 * ```
 */
export function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return function (instance: T | null) {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(instance)
      } else if (ref) {
        ;(ref as React.MutableRefObject<T | null>).current = instance
      }
    }
  }
}
