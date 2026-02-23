interface BrandMarkProps {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className={`brand-block${compact ? ' brand-block-compact' : ''}`}>
      <div className="logo-glyph" aria-hidden="true">
        <span className="logo-stroke logo-stroke-top" />
        <span className="logo-stroke logo-stroke-mid" />
        <span className="logo-stroke logo-stroke-diag" />
      </div>
      <span className="brand-word">ZYRA</span>
    </div>
  )
}
