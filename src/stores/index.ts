// 参考 https://github.com/LegendApp/legend-state
// https://github.com/preactjs/signals/tree/main/packages/react

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
export * from '@vue/reactivity'
import type { Ref, UnwrapRef } from '@vue/reactivity'
import { ReactiveEffect, computed, ref } from '@vue/reactivity'
import { memo } from 'react'
import { ulid } from 'ulid'

const storeMap = new Map<string, any>()

const ReactForwardRefSymbol = Symbol.for('react.forward_ref')

/**
 * Define a store, the store will be created only once when the first time useStore is called
 * @param setup setup function, see {@link https://pinia.vuejs.org/core-concepts/#setup-stores Pinia fefine setup store}
 * @example
 * ```tsx
 * const useUserStore = defineStore(() => {
 *   const userName = ref('user')
 *   const userEmail = ref('example@mail.com')
 *
 *   function changeUserName(name: string) {
 *     userName.value = name
 *   }
 *
 *   return { userName, userEmail }
 * })
 *
 * // In react component, wrap with reactivity to make it auto re-render
 * const User = reactivity(() => {
 *   const userStore = useUserStore()
 *
 *   return (
 *     <div>
 *       <div>{userStore.userName}</div>
 *       <div>{userStore.userEmail}</div>
 *     </div>
 *   )
 * })
 *
 * // outside component, use store directly or call useStore for lazy init
 * const userStore = useUserStore()
 *
 * function changeUserEmail() {
 *   const userStore = useUserStore()
 *   userStore.userEmail = ''
 * }
 * ```
 * @returns useStore function to get store
 */
export function defineStore<SS>(setup: () => SS) {
  const id = ulid()

  return function useStore() {
    let store = storeMap.get(id) as Ref<UnwrapRef<SS>> | undefined

    if (!store) {
      store = ref(setup())
      storeMap.set(id, store)
    }

    return store.value as UnwrapRef<SS>
  }
}

/**
 * Make a component reactive, the component will re-render when store changed, same as {@link https://mobx.js.org/api.html#observer mobx observer}
 * @param baseComponent
 * @example
 * ```tsx
 * const User = reactivity(() => {
 *   const userStore = useUserStore()
 *   return (
 *     <div>
 *       <div>{userStore.userName}</div>
 *       <div>{userStore.userEmail}</div>
 *     </div>
 *   )
 * })
 * ```
 * @returns
 */
export function reactivity<P extends object, TRef = {}>(
  baseComponent:
    | React.ForwardRefRenderFunction<TRef, P>
    | React.FunctionComponent<P>
    | React.ForwardRefExoticComponent<React.PropsWithRef<P> & React.RefAttributes<TRef>>
) {
  const render = baseComponent
  const baseComponentName = baseComponent.displayName || baseComponent.name

  let observerComponent = (props: any, ref: React.Ref<TRef>) =>
    useObserver(() => render(props, ref), baseComponentName)

  ;(observerComponent as React.FunctionComponent).displayName = baseComponent.displayName

  Object.defineProperty(observerComponent, 'name', {
    value: baseComponent.name,
    writable: true,
    configurable: true,
  })

  // @ts-expect-error $$typeof is not in the type definition
  if (baseComponent['$$typeof'] === ReactForwardRefSymbol) {
    observerComponent = forwardRef(observerComponent)
  }

  observerComponent = memo(observerComponent)

  return observerComponent
}

function useObserver<T>(render: () => T, baseComponentName = 'observed') {
  const forceUpdate = useState<Record<never, never>>()[1]

  const effect = useMemo(() => {
    return new ReactiveEffect(render, () => forceUpdate({}))
  }, [])

  useEffect(() => () => effect.stop(), [])

  return effect.run()
}

/**
 * use computed inside react component
 * @param getter getter function
 * @example
 * ```tsx
 * const User = reactivity(() => {
 *   const userStore = useUserStore()
 *   const userName = useComputed(() => `UserName: ${userStore.userName}`)
 *
 *   return (
 *     <div>
 *       <div>{userName}</div>
 *       <div>{userStore.userEmail}</div>
 *     </div>
 *   )
 * })
 * @returns
 */
const useComputed = <T>(getter: () => T) => useMemo(() => computed(getter), []).value

// TODO: asyncComputed
// const a = ref(1)
// const b = asyncComputed(() => someAsyncFunction(a.value), 0)
