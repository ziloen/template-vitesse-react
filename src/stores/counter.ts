import { makeAutoObservable, runInAction } from 'mobx'

class Counter {
  constructor() {
    makeAutoObservable(this)
  }

  count = 0

  get double() {
    return this.count * 2
  }

  increment(step = 1) {
    runInAction(() => {
      this.count += step
    })
  }

  decrement(step = 1) {
    runInAction(() => {
      this.count -= step
    })
  }
}


export const counterStore = new Counter