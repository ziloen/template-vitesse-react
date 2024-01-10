export function Offscreen({
  children,
  mode = 'hidden'
}: {
  children: React.ReactNode
  mode: 'hidden' | 'visible'
}) {
  const slotRef = useRef<HTMLSlotElement>(null)

  const fragmentSlot = useMemo(() => document.createElement('slot'), [])

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    if (mode === 'visible' && !fragmentSlot.isConnected) {
      slot.append(fragmentSlot)
    } else if (mode === 'hidden') {
      fragmentSlot.remove()
    }
  }, [mode])

  return (
    <slot ref={slotRef}>
      {createPortal(children, fragmentSlot)}
    </slot>
  )
}