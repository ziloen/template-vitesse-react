export * from './useElementBounding'
export * from './useI18n'
export * from './useMagicKeys'
export * from './useNextTick'


export function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return function (instance: T | null) {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(instance)
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = instance
      }
    }
  }
}