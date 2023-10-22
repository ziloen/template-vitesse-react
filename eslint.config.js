import { format, react } from "@ziloen/eslint-config"


/** @type { import("@ziloen/eslint-config").FlatESLintConfigItem[] } */
export default [
  ...react,
  ...format
]