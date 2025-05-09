// https://vueuse.org/core/useMagicKeys/
import { useMemo } from 'react'

export function useMagicKeys() {
  const usedKeys = useMemo(() => new Set<string>(), [])

  const proxy = useMemo(
    () =>
      new Proxy(
        {},
        {
          get(target, p, receiver) {},
        },
      ),
    [],
  )

  return proxy as Record<string, boolean>
}
