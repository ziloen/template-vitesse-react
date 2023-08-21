/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/ban-types */
declare namespace React {
  // fix react forwardRef, https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
  function forwardRef<T, P = {}>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null

  // allow style to use css custom properties
  interface CSSProperties {
    [CSSCutomProperties: `--${string}`]: string | number | undefined
  }
  // allow destructor return value
  function useEffect(effect: () => (void | (() => void)), deps?: DependencyList): void
}