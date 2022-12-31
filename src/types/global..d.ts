/**
 * declare global util types
 */
export { }
declare global {
  type Fn<Args extends readonly unknown[] = any[], Return = any> = (...args: Args) => Return
}