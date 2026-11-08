import './DecoCube.scss'

interface DecoCubeProps {
  className?: string
}

export const DecoCube = ({ className = '' }: DecoCubeProps) => (
  <div className={`deco-cube ${className}`} aria-hidden="true">
    <div className="deco-cube__inner">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  </div>
)
