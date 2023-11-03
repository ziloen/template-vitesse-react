export * from './useElementBounding'
export * from './useI18n'
export * from './useMagicKeys'


export function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return function (value: T | null) {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = value
      }
    }
  }
}