// https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-utilities/src/utils/isHTMLElement.ts
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_realms

/**
 * Verifies if a given node is an HTMLElement,
 * this method works seamlessly with frames and elements from different documents
 *
 * This is preferred over simply using `instanceof`.
 * Since `instanceof` might be problematic while operating with [multiple realms](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_realms)
 *
 * @example
 * ```ts
 * isHTMLElement(event.target) && event.target.focus()
 * isHTMLElement(event.target, {constructorName: 'HTMLInputElement'}) && event.target.value // some value
 * ```
 *
 */
export function isHTMLElement<
  ConstructorName extends HTMLElementConstructorName = never,
>(
  element?: unknown,
  options?: {
    /**
     * Can be used to provide a custom constructor instead of `HTMLElement`,
     * Like `HTMLInputElement` for example.
     */
    constructorName?: ConstructorName
  },
): element is InstanceType<
  (typeof globalThis)[[ConstructorName] extends [never]
    ? 'HTMLElement'
    : ConstructorName]
> {
  const typedElement = element as Node | null | undefined
  return Boolean(
    typedElement?.ownerDocument?.defaultView &&
      typedElement instanceof
        typedElement.ownerDocument.defaultView[
          options?.constructorName ?? 'HTMLElement'
        ],
  )
}

export function isInstanceofElement<T extends typeof Element>(
  element: unknown,
  instance: T,
): element is T['prototype'] {
  if (element instanceof instance) {
    return true
  }

  return isHTMLElement(element, {
    constructorName: instance.name as HTMLElementConstructorName,
  })
}

/**
 * @internal
 */
export type HTMLElementConstructorName =
  | 'HTMLElement'
  | 'HTMLAnchorElement'
  | 'HTMLAreaElement'
  | 'HTMLAudioElement'
  | 'HTMLBaseElement'
  | 'HTMLBodyElement'
  | 'HTMLBRElement'
  | 'HTMLButtonElement'
  | 'HTMLCanvasElement'
  | 'HTMLDataElement'
  | 'HTMLDataListElement'
  | 'HTMLDetailsElement'
  | 'HTMLDialogElement'
  | 'HTMLDivElement'
  | 'HTMLDListElement'
  | 'HTMLEmbedElement'
  | 'HTMLFieldSetElement'
  | 'HTMLFormElement'
  | 'HTMLHeadingElement'
  | 'HTMLHeadElement'
  | 'HTMLHRElement'
  | 'HTMLHtmlElement'
  | 'HTMLIFrameElement'
  | 'HTMLImageElement'
  | 'HTMLInputElement'
  | 'HTMLModElement'
  | 'HTMLLabelElement'
  | 'HTMLLegendElement'
  | 'HTMLLIElement'
  | 'HTMLLinkElement'
  | 'HTMLMapElement'
  | 'HTMLMetaElement'
  | 'HTMLMeterElement'
  | 'HTMLObjectElement'
  | 'HTMLOListElement'
  | 'HTMLOptGroupElement'
  | 'HTMLOptionElement'
  | 'HTMLOutputElement'
  | 'HTMLParagraphElement'
  | 'HTMLParamElement'
  | 'HTMLPreElement'
  | 'HTMLProgressElement'
  | 'HTMLQuoteElement'
  | 'HTMLSlotElement'
  | 'HTMLScriptElement'
  | 'HTMLSelectElement'
  | 'HTMLSourceElement'
  | 'HTMLSpanElement'
  | 'HTMLStyleElement'
  | 'HTMLTableElement'
  | 'HTMLTableColElement'
  | 'HTMLTableRowElement'
  | 'HTMLTableSectionElement'
  | 'HTMLTemplateElement'
  | 'HTMLTextAreaElement'
  | 'HTMLTimeElement'
  | 'HTMLTitleElement'
  | 'HTMLTrackElement'
  | 'HTMLUListElement'
  | 'HTMLVideoElement'
