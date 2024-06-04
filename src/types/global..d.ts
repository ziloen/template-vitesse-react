/* eslint-disable no-var */
/** 
 * @deprecated 
 * use `import.meta.env.PROD` instead
 * 
 * [Env Variables](https://vitejs.dev/guide/env-and-mode.html#env-variables)
 */
declare const IS_PROD: boolean

/**
 * @deprecated
 * use `import.meta.env.DEV` instead
 * 
 * [Env Variables](https://vitejs.dev/guide/env-and-mode.html#env-variables)
 */
declare const IS_DEV: boolean

declare const IS_BUILD: boolean

// use var to declare globalThis / window variable
declare var __REACT_DEVTOOLS_GLOBAL_HOOK__: boolean | undefined
