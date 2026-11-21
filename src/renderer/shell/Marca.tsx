function RengDegradado({ id: rengId }: { id: string }): React.JSX.Element {
  return (
    <defs>
      <linearGradient id={rengId} gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="44" y2="44">
        <stop offset="0" style={{ stopColor: 'var(--accent-3)' }} />
        <stop offset="1" style={{ stopColor: 'var(--accent)' }} />
      </linearGradient>
    </defs>
  )
}

function RengTrazo({ id: rengId }: { id: string }): React.JSX.Element {
  return (
    <>
      <path d="M24 7 L38.7 15.5 L38.7 32.5 L24 41 L9.3 32.5 L9.3 15.5 Z" fill="none" stroke={`url(#${rengId})`} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="7.5" fill="none" stroke={`url(#${rengId})`} strokeWidth="2.2" />
      <circle cx="24" cy="7" r="3.4" fill={`url(#${rengId})`} />
      <circle cx="38.7" cy="32.5" r="3.4" fill={`url(#${rengId})`} />
      <circle cx="9.3" cy="32.5" r="3.4" fill={`url(#${rengId})`} />
    </>
  )
}

export function RengBrandMark(): React.JSX.Element {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <RengDegradado id="marca-chica" />
      <RengTrazo id="marca-chica" />
    </svg>
  )
}

export function RengMarcaGrande(): React.JSX.Element {
  return (
    <svg className="atom" viewBox="0 0 48 48" aria-hidden="true">
      <RengDegradado id="marca-grande" />
      <RengTrazo id="marca-grande" />
    </svg>
  )
}
