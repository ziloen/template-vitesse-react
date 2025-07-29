import type { ReactElement, ReactNode } from 'react'
import { Fragment, cloneElement, createElement, isValidElement } from 'react'
import { useTranslation } from 'react-i18next'
import type ENJSON from '../locales/en.json'
import { useMemoizedFn } from './useMemoizedFn'

type JoinKeys<K1, K2> = `${K1 & string}.${K2 & string}`
type $OmitArrayKeys<Arr> = Arr extends readonly any[]
  ? Omit<Arr, keyof any[]>
  : Arr
type $Dictionary<T = unknown> = { [key: string]: T }
type KeysBuilderWithoutReturnObjects<
  Res,
  Key = keyof $OmitArrayKeys<Res>,
> = Key extends keyof Res
  ? Res[Key] extends $Dictionary | readonly unknown[]
    ? JoinKeys<Key, KeysBuilderWithoutReturnObjects<Res[Key]>>
    : Key
  : never

export type I18nKeys = KeysBuilderWithoutReturnObjects<typeof ENJSON>

type CustomTFunction = {
  (key: I18nKeys): string
  (key: I18nKeys, data: Record<string, string>): string
  (
    key: I18nKeys,
    data: Record<
      string,
      ((content: string) => ReactNode) | ReactElement | string | string[]
    >,
  ): React.ReactElement
}

/**
 * match `<tagName>tagContent</tagName>` or `{{variable}}`
 */
const TEMPLATE_REGEX =
  /<(?<tagName>\w+)>(?<tagContent>.*?)<\/\k<tagName>>|{{(?<variable>\w+)}}/g

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
 *      element: <span className="text-red" />,
 *      list: ['apple', 'banana', 'cherry'],
 *      // will be formatted as "apple, banana, and cherry"
 *    })}
 *   </div>
 * )
 * ```
 */
export function useI18n(...args: Parameters<typeof useTranslation>) {
  const { t, i18n, ready } = useTranslation(...args)

  return {
    t: useMemoizedFn(function customT(key, data) {
      // TODO: support `<notranslate>content</notranslate>` to interpolate without data
      if (!data) return t(key)

      // name: text => <span>{text}</span>
      const fnData = new Map<string, (content: string) => ReactNode>()
      // name: <span className="text-red" />
      const elementData = new Map<string, ReactElement>()
      // name: 'text' | ['text1', 'text2', 'text3']
      const stringData = Object.create(null) as Record<
        string,
        string | string[]
      >

      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'function') {
          fnData.set(key, val)
        } else if (isValidElement(val)) {
          elementData.set(key, val)
        } else {
          stringData[key] = val
        }
      }

      // original translation result
      const text = t(key, stringData)

      const result: ReactNode[] = []
      let lastIndex = 0

      // match all interpolation
      for (const match of text.matchAll(TEMPLATE_REGEX)) {
        if (match.index === undefined) continue

        const fullMatch = match[0]
        const { tagName, tagContent, variable } = match.groups ?? {}
        const textBetweenMatches = text.slice(lastIndex, match.index)
        lastIndex = match.index + fullMatch.length

        // push content between last match and current match
        if (textBetweenMatches) {
          result.push(textBetweenMatches)
        }

        if (tagName) {
          // match <tagName>tagContent</tagName>
          const render = fnData.get(tagName) ?? elementData.get(tagName)

          if (!render && Array.isArray(stringData[tagName])) {
            result.push(listFormat(stringData[tagName], i18n.language))
          } else {
            result.push(getRendered(render, tagContent))
          }
        } else if (variable) {
          // match {{variable}}
          const element = elementData.get(variable)

          result.push(element ?? fullMatch)
        }
      }

      // push everything after last match
      const last = text.slice(lastIndex)
      if (last) result.push(last)

      // combine all results
      return createElement(Fragment, null, ...result)
    } as CustomTFunction),
    i18n,
    ready,
  }
}

/**
 * @example
 * ```ts
 * const formatted = listFormat(['apple', 'banana', 'cherry'], 'en-US')
 * //    ^ "apple, banana, and cherry"
 * const formatted = listFormat(['苹果', '香蕉', '樱桃'], 'zh-CN')
 * //    ^ "苹果、香蕉和樱桃"
 * ```
 */
export function listFormat(
  list: readonly string[],
  language: string,
  options?: {
    /**
     * - "conjunction": A, B, and C,
     * - "disjunction": A, B, or C,
     * - "unit": A, B, C
     */
    type?: Intl.ListFormatType | undefined
    /**
     * - "long": A, B, and C
     * - "short": A, B, & C,
     * - "narrow": A, B, C
     */
    style?: Intl.ListFormatStyle | undefined
  },
): string {
  try {
    return new Intl.ListFormat(language, {
      type: 'conjunction',
      style: 'long',
      ...options,
    }).format(list)
  } catch {
    return list.join(', ')
  }
}

/**
 * @example
 * ```ts
 * const displayName = getLanguageDisplayName('zh-Hans', 'en-US')
 * //    ^ "Chinese (Simplified)"
 * ```
 */
export function getLanguageDisplayName(
  language: string,
  toLanguage: string,
  options: Omit<Intl.DisplayNamesOptions, 'type'> = {
    fallback: 'code',
  },
) {
  try {
    return new Intl.DisplayNames([toLanguage], {
      type: 'language',
      ...options,
    }).of(language)
  } catch {
    return language
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
