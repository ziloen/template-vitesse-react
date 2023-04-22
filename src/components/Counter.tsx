import { observer } from 'mobx-react'
import { counterStore } from '~/stores/counter'


export const Counter = observer(() =>
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
