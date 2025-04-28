/* eslint-disable no-var */
/**
 * @deprecated
 * use `import.meta.env.PROD` instead
 *
 * [Built-in constants](https://vite.dev/guide/env-and-mode.html#built-in-constants)
 */
declare const IS_PROD: boolean

/**
 * @deprecated
 * use `import.meta.env.DEV` instead
 *
 * [Built-in constants](https://vite.dev/guide/env-and-mode.html#built-in-constants)
 */
declare const IS_DEV: boolean

declare const IS_BUILD: boolean

// use var to declare globalThis / window variable
declare var __REACT_DEVTOOLS_GLOBAL_HOOK__: boolean | undefined
