import { isFn } from '@wai-ri/core'
import { Fragment, ReactElement, ReactNode, cloneElement, createElement, isValidElement } from 'react'
import { useTranslation } from 'react-i18next'

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
export function useI18n(
  ...args: Parameters<typeof useTranslation>
) {
  const { t, i18n, ready } = useTranslation(...args)

  return {
    t: useMemo(() => {
      function CustomTFn(key: string): string
      function CustomTFn(key: string, data: Record<string, string>): string
      function CustomTFn(
        key: string,
        data: Record<string, ((content: string) => ReactNode) | ReactNode>
      ): ReactNode
      function CustomTFn(
        key: string,
        data?: Record<string, ((content: string) => ReactNode) | ReactNode>
      ) {
        if (!data) return t(key)

        // name: text => <span>{text}</span>
        const fnData = new Map<string, (content: string) => ReactNode>()
        // name: <span className="text-red" />
        const elementData = new Map<string, ReactElement>()
        // name: 'text'
        const originalData = Object.create(null) as Record<string, unknown>

        for (const [key, val] of Object.entries(data)) {
          if (isFn(val)) {
            fnData.set(key, val)
          } else if (isValidElement(val)) {
            elementData.set(key, val)
          } else {
            originalData[key] = val
          }
        }

        if (fnData.size === 0 && elementData.size === 0) return t(key, originalData)

        // original translation result
        const text = t(key, originalData)

        // match <tag>content</tag> or {{variable}}
        const regex = /<(\w+)>(.*?)<\/\1>|{{(\w+)}}/g
        let match
        const result = [] as ReactNode[]
        let lastIndex = 0

        // match all interpolation
        while ((match = regex.exec(text)) !== null) {
          const [full, tag, content, variable] = match
          const before = text.slice(lastIndex, match.index)
          lastIndex = regex.lastIndex

          // push before content
          if (before) result.push(before)

          if (tag) {
            // match <tag>content</tag>
            const fn = fnData.get(tag)

            if (fn) {
              result.push(fn(content))
            } else {
              const element = elementData.get(tag)

              if (element) {
                result.push(cloneElement(element, { children: content }))
              } else {
                result.push(content)
              }
            }
          } else if (variable) {
            // match {{variable}}
            const element = elementData.get(variable)

            if (element) {
              result.push(element)
            } else {
              result.push(full)
            }
          }
        }

        // push last content
        const last = text.slice(lastIndex)
        if (last) result.push(last)

        // combine all results
        return createElement(Fragment, null, ...result)
      }

      return CustomTFn
    }, [t]),
    i18n,
    ready
  }
}