import { withMobxStore } from '~/stores'
import { counterStore } from '~/stores/counter'


export const Counter = withMobxStore({ counterStore })(({ counterStore }) =>
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
