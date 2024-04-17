// https://vueuse.org/core/useCycleList/#usecyclelist

type UseCycleListOptions<T> = {
  /**
   * @default list[0]
   */
  initialValue?: T
}

export function useCycleList<T>(
  list: T[],
  options: UseCycleListOptions<T> = {}
) {
  const [index, setIndex] = useState(() => {
    const index = list.indexOf(options.initialValue as T)
    return index === -1 ? 0 : index
  })

  const latestIndex = useRef(index)
  latestIndex.current = index

  return {
    index,
    state: list[index] as T,
    next: (n = 1) => {
      const index = latestIndex.current
      const nextIndex = (index + n) % list.length
      setIndex(nextIndex)
      return list[nextIndex] as T
    },
    prev: (n = 1) => {
      const index = latestIndex.current
      const prevIndex = (index - n + list.length) % list.length
      setIndex(prevIndex)
      return list[prevIndex] as T
    },
    go: (index: number) => {
      setIndex(index)
      return list[index] as T
    },
  }
}
