// https://vueuse.org/core/useCycleList/#usecyclelist

type UseCycleListOptions = {
  /**
   * @default 0
   */
  initialIndex?: number
}

export function useCycleList<T>(list: T[], options: UseCycleListOptions = {}) {
  const [index, setIndex] = useState(options.initialIndex ?? 0)

  return {
    index,
    state: list[index] as T,
    next: (n = 1) => {
      setIndex(i => (i + n) % list.length)
    },
    prev: (n = 1) => {
      setIndex(i => (i - n + list.length) % list.length)
    },
    go: (index: number) => {
      setIndex(index)
    },
  }
}
