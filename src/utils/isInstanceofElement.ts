// https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-utilities/src/utils/isHTMLElement.ts
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_realms

/**
 * Verifies if a given node is an HTMLElement,
 * this method works seamlessly with frames and elements from different documents
 *
 * This is preferred over simply using `instanceof`.
 * Since `instanceof` might be problematic while operating with [multiple realms](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_realms)
 *
 * @example
 * ```ts
 * isInstanceofElement(event.target, HTMLElement) && event.target.focus()
 * isInstanceofElement(event.target, HTMLInputElement) && event.target.value // some value
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function isInstanceofElement<T extends typeof Element>(
  element: Node | null | undefined,
  instance: T,
): element is T['prototype'] {
  if (element instanceof instance) {
    return true
  }

  return Boolean(
    element?.ownerDocument?.defaultView &&
      element instanceof
        element.ownerDocument.defaultView[
          instance.name as keyof typeof globalThis
        ],
  )
}
