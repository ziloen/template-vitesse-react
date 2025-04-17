declare module 'react' {
  // allow style to use css custom properties
  interface CSSProperties {
    [CSSCutomProperties: `--${string}`]: string | number | undefined
  }

  // allow destructor return value
  function useEffect(
    effect: () => void | (() => void),
    deps?: DependencyList,
  ): void
  function useInsertionEffect(
    effect: () => void | (() => void),
    deps?: DependencyList,
  ): void
  function useLayoutEffect(
    effect: () => void | (() => void),
    deps?: DependencyList,
  ): void
}

declare module 'axios' {
  // Add zod type to axios request config
  interface AxiosRequestConfig {
    requestSchema?: import('zod').ZodTypeAny
    responseSchema?: import('zod').ZodTypeAny
  }
}

export { }

