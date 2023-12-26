import type { BehaviorSubject } from 'rxjs'

export function useBehaviorSubject<T>(subject: BehaviorSubject<T>) {
  const [value, setValue] = useState(subject.value)

  useEffect(() => {
    const subscription = subject.subscribe(setValue)
    return () => subscription.unsubscribe()
  }, [subject])

  return value
}
