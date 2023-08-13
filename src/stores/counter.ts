import { computed, ref } from '@vue/reactivity'
import { defineStore } from '.'

export const useCounterStore = defineStore(() => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment(step = 1) {
    count.value += step
  }

  function decrement(step = 1) {
    count.value -= step
  }

  return {
    count,
    double,
    increment,
    decrement
  }
})