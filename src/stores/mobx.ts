import { configure, observable } from 'mobx'
import { ulid } from 'ulid'

configure({
  enforceActions: 'never',
  useProxies: 'always',
})

const storeMap = new Map<string, any>()


function defineStore<SS>(setup: () => SS) {
  const id = ulid()

  return function useStore() {
    let store = storeMap.get(id) as SS | undefined

    if (!store) {
      store = setup()
      storeMap.set(id, store)
    }

    return store
  }
}

export const useMobxStore = defineStore(() => {
  const count = observable.box(0)

  function increment(step = 1) {
    count.set(count.get() + step)
  }

  function decrement(step = 1) {
    count.set(count.get() - step)
  }

  return {
    count,
    get double() { return count.get() * 2 },
    increment,
    decrement,
  }
})
