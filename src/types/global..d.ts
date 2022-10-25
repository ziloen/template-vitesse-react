/**
 * declare global util types
 */
export {}
declare global {
  type Fn<Args extends any[] = any[], Return = any> = (...args: Args) => Return
}