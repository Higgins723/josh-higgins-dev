interface MobileControlsProps {
  onLeft: (down: boolean) => void
  onRight: (down: boolean) => void
  onJump: (down: boolean) => void
  onInteract: () => void
}

export function MobileControls({
  onLeft,
  onRight,
  onJump,
  onInteract,
}: MobileControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex items-end justify-between p-4 sm:hidden">
      <div className="pointer-events-auto flex gap-2">
        <PadBtn label="◀" onPress={onLeft} />
        <PadBtn label="▶" onPress={onRight} />
      </div>
      <div className="pointer-events-auto flex gap-2">
        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--color-line)] bg-[var(--color-panel)]/90 text-xs font-semibold text-white shadow-lg active:scale-95"
          onClick={onInteract}
        >
          E
        </button>
        <PadBtn label="A" onPress={onJump} accent />
      </div>
    </div>
  )
}

function PadBtn({
  label,
  onPress,
  accent,
}: {
  label: string
  onPress: (down: boolean) => void
  accent?: boolean
}) {
  return (
    <button
      type="button"
      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg active:scale-95 ${
        accent
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/90 text-[var(--color-ink)]'
          : 'border-[var(--color-line)] bg-[var(--color-panel)]/90 text-white'
      }`}
      onPointerDown={(e) => {
        e.preventDefault()
        onPress(true)
      }}
      onPointerUp={(e) => {
        e.preventDefault()
        onPress(false)
      }}
      onPointerLeave={() => onPress(false)}
      onPointerCancel={() => onPress(false)}
    >
      {label}
    </button>
  )
}
