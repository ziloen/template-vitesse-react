import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react'



export function withMobxStore<S extends Record<string, any>>(storeProps: S) {
  return function <Props>(comp: React.ComponentType<S & Omit<Props, keyof S>>) {
    const ObserverComp = observer(comp)

    return function WithMobxStoreComponent(props: Props) {
      return <ObserverComp {...props} {...storeProps} />
    }
  }
}