// react@experimental
// React.unstable_Activity: Symbol("react.offscreen") / Symbol.for("react.offscreen")

/**
 * A simulation of the React Offscreen Component
 */
export function Offscreen({
  children,
  mode = 'hidden',
}: {
  children: React.ReactNode
  mode: 'hidden' | 'visible'
}) {
  const slotRef = useRef<HTMLSlotElement>(null)

  const childrenSlot = useMemo(() => document.createElement('slot'), [])

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    if (mode === 'visible' && !childrenSlot.isConnected) {
      slot.replaceWith(childrenSlot)
    } else if (mode === 'hidden') {
      childrenSlot.replaceWith(slot)
    }
  }, [mode])

  return <slot ref={slotRef}>{createPortal(children, childrenSlot)}</slot>
}
