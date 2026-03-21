import logo from '../assets/img/zyra.png'

interface BrandMarkProps {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className={`brand-block${compact ? ' brand-block-compact' : ''}`}>
      <img className="brand-logo" src={logo} alt="Zyra logo" />
      <span className="brand-word">ZYRA</span>
    </div>
  )
}
