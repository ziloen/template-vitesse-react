import { isFn } from '@wai-ri/core'
import { Fragment, ReactElement, ReactNode, cloneElement, createElement, isValidElement } from 'react'
import { useTranslation } from 'react-i18next'

export function useI18n(
  ...args: Parameters<typeof useTranslation>
) {
  const { t, i18n, ready } = useTranslation(...args)

  return {
    t: useMemo(() => toCustomTFn(t), [t]),
    i18n,
    ready
  }
}


function toCustomTFn(t: ReturnType<typeof useTranslation>[0]) {
  function CustomTFn(
    key: string
  ): string
  function CustomTFn(
    key: string,
    data: Record< string, ((content: string) => ReactNode) | ReactNode>
  ): string
  function CustomTFn(
    key: string,
    data?: Record<
      string,
      ((content: string) => ReactNode) | ReactNode
    >
  ) {
    if (!data) return t(key)

    const fnData = new Map<string, ((content: string) => ReactNode)>()
    const elementData = new Map<string, ReactElement>()
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
    const tResult = t(key, originalData)

    // match <tag>content</tag> or {{variable}}
    const regex = /<(\w+)>(.*?)<\/\1>|{{(\w+)}}/g
    let match
    const customResult = [] as ReactNode[]
    let lastIndex = 0

    while ((match = regex.exec(tResult)) !== null) {
      const [fullMatch, tag, content, variable] = match
      const before = tResult.slice(lastIndex, match.index)
      lastIndex = regex.lastIndex

      if (before) customResult.push(before)

      if (tag) {
        const fn = fnData.get(tag)

        if (fn) {
          customResult.push(fn(content))
        } else {
          const element = elementData.get(tag)
          if (element) {
            customResult.push(cloneElement(element, { children: content }))
          } else {
            customResult.push(content)
          }
        }
      } else if (variable) {
        const element = elementData.get(variable)

        if (element) {
          customResult.push(element)
        } else {
          customResult.push(fullMatch)
        }
      }
    }

    return createElement(Fragment, null, ...customResult)
  }

  return CustomTFn
}