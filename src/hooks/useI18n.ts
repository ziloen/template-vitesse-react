import type { ReactElement, ReactNode } from 'react'
import { Fragment, cloneElement, createElement, isValidElement } from 'react'
import { useTranslation } from 'react-i18next'
import type ENJSON from '../locales/en.json'

type JoinKeys<K1, K2> = `${K1 & string}.${K2 & string}`
type KeysBuilder<Res> = KeysBuilderWithoutReturnObjects<Res>
type $OmitArrayKeys<Arr> = Arr extends readonly any[]
  ? Omit<Arr, keyof any[]>
  : Arr
export type $Dictionary<T = unknown> = { [key: string]: T }
type KeysBuilderWithoutReturnObjects<
  Res,
  Key = keyof $OmitArrayKeys<Res>,
> = Key extends keyof Res
  ? Res[Key] extends $Dictionary | readonly unknown[]
    ? JoinKeys<Key, KeysBuilderWithoutReturnObjects<Res[Key]>>
    : Key
  : never
type Keys = KeysBuilder<typeof ENJSON>

/**
 * Support custom tag, variable and element in translation string.
 * @example
 * ```
 * const { t } = useI18n()
 *
 * return (
 *   <div>
 *    {t('hello', {
 *      variable: <span>world</span>,
 *      tag: text => <strong>{text}</strong>,
 *      element: <span className="text-red" />
 *    })}
 *   </div>
 * )
 * ```
 */
export function useI18n(...args: Parameters<typeof useTranslation>) {
  const { t, i18n, ready } = useTranslation(...args)

  return {
    t: useMemo(() => {
      function CustomTFn(key: Keys): string
      function CustomTFn(key: Keys, data: Record<string, string>): string
      function CustomTFn(
        key: Keys,
        data: Record<string, ((content: string) => ReactNode) | ReactNode>,
      ): ReactNode
      function CustomTFn(
        key: Keys,
        data?: Record<string, ((content: string) => ReactNode) | ReactNode>,
      ) {
        if (!data) return t(key)

        // name: text => <span>{text}</span>
        const fnData = new Map<string, (content: string) => ReactNode>()
        // name: <span className="text-red" />
        const elementData = new Map<string, ReactElement>()
        // name: 'text'
        const stringData = Object.create(null) as Record<string, unknown>

        for (const [key, val] of Object.entries(data)) {
          if (typeof val === 'function') {
            fnData.set(key, val)
          } else if (isValidElement(val)) {
            elementData.set(key, val)
          } else {
            stringData[key] = val
          }
        }

        if (fnData.size === 0 && elementData.size === 0) {
          return t(key, stringData)
        }

        // original translation result
        const text = t(key, stringData)

        // match <tag>content</tag> or {{variable}}
        const regex = /<(\w+)>(.*?)<\/\1>|{{(\w+)}}/g
        const result = [] as ReactNode[]
        let lastIndex = 0

        // match all interpolation
        for (const match of text.matchAll(regex)) {
          if (match.index === undefined) continue
          const [full, tagName, content, variable] = match
          const before = text.slice(lastIndex, match.index)
          lastIndex = match.index + full.length

          // push content between last match and current match
          if (before) result.push(before)

          if (tagName) {
            // match <tag>content</tag>
            const render = fnData.get(tagName) ?? elementData.get(tagName)
            result.push(getRendered(render, content))
          } else if (variable) {
            // match {{variable}}
            const element = elementData.get(variable)

            result.push(element ?? full)
          }
        }

        // push everything after last match
        const last = text.slice(lastIndex)
        if (last) result.push(last)

        // combine all results
        return createElement(Fragment, null, ...result)
      }

      return CustomTFn
    }, [t]),
    i18n,
    ready,
  }
}

const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

/**
 * get content from function or element
 */
function getRendered(
  getter: ((content: string) => ReactNode) | ReactElement | undefined,
  content: string | undefined,
) {
  if (!getter || !content) {
    return content
  }

  if (typeof getter === 'function') {
    return getter(content)
  }

  const isVoid =
    typeof getter.type === 'string' && voidElements.has(getter.type)

  return cloneElement(getter, undefined, isVoid ? undefined : content)
}
