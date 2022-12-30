/**
 * declare or fix module types
 * /// <reference type="" />
 */

import { } from "react"
declare module "react" {
  // fix react forwardRef, https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
  function forwardRef<T, P = {}>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null
}