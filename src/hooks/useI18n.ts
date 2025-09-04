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
      ((children: ReactNode) => ReactNode) | ReactElement | string | string[]
    >,
  ): React.ReactElement
}

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
      // name: children => <span>{children}</span>
      const fnData = new Map<string, (children: ReactNode) => ReactNode>()
      // name: <span className="text-red" />
      const elementData = new Map<string, ReactElement>()
      // name: 'text' | ['text1', 'text2', 'text3']
      const stringData = Object.create(null) as Record<
        string,
        string | string[]
      >

      for (const [key, val] of Object.entries(data ?? {})) {
        if (typeof val === 'function') {
          fnData.set(key, val)
        } else if (isValidElement(val)) {
          elementData.set(key, val)
        } else {
          stringData[key] = val
        }
      }

      return parseTemplate(
        t(key, stringData),
        elementData,
        fnData,
        stringData,
        i18n.language,
      )
    } as CustomTFunction),
    i18n,
    ready,
  }
}

/**
 * match `<tagName>tagContent</tagName>` or `{{variable}}`
 */
const TEMPLATE_REGEX =
  /<(?<tagName>\w+)>(?<tagContent>.*?)<\/\k<tagName>>|{{(?<variable>\w+)}}/g

function parseTemplate(
  text: string,
  elementData: Map<string, ReactElement>,
  fnData: Map<string, (children: ReactNode) => ReactNode>,
  stringData: Record<string, string | string[]>,
  language: string,
): string | ReactElement {
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
        result.push(listFormat(stringData[tagName], language))
      } else {
        // recursively parse nested tag and variables
        // <b>bold and <i>italic</i></b>
        // <b>bold and {{variable}}</b>
        const parsedTagContent = tagContent
          ? parseTemplate(tagContent, elementData, fnData, stringData, language)
          : tagContent

        result.push(getRendered(render, parsedTagContent))
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

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
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
  getter: ((children: ReactNode) => ReactNode) | ReactElement | undefined,
  children: string | undefined | ReactNode,
) {
  if (!getter || !children) {
    return children
  }

  if (typeof getter === 'function') {
    return getter(children)
  }

  const isVoid =
    typeof getter.type === 'string' && voidElements.has(getter.type)

  return cloneElement(getter, undefined, isVoid ? undefined : children)
}
