interface Props { value: number; size?: number; strokeWidth?: number }

export default function ProgressNebula({ value, size = 80, strokeWidth = 6 }: Props) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference
  const color = value >= 70 ? '#22d3ee' : value >= 50 ? '#a78bfa' : '#fb7185'

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}99)`, transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}
