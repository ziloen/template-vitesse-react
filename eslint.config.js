import { react } from '@ziloen/eslint-config'

/** @type {import("@ziloen/eslint-config").ConfigArray} */
export default [
  ...react({ project: ['./tsconfig.json', './tsconfig.node.json'] }),
]
