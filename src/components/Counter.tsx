import { reactivity } from '~/stores'
import { useCounterStore } from '~/stores/counter'


export const Counter = reactivity(() => {
  const counterStore = useCounterStore()

  return (
    <div>
      <div>
        <span>count: </span>
        {counterStore.count}
      </div>
      <div>
        <span>double: </span>
        {counterStore.double}
      </div>
      <button className="btn" onClick={() => counterStore.increment()}>
        +
      </button>
      <button className="btn" onClick={() => counterStore.decrement()}>
        -
      </button>
    </div>
  )
})
