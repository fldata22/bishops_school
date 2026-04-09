interface Props { status: 'present' | 'absent' }

export default function StatusBadge({ status }: Props) {
  const isPresent = status === 'present'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-label font-semibold uppercase tracking-wide border
      ${isPresent
        ? 'bg-secondary/15 border-secondary/25 text-secondary-dim'
        : 'bg-tertiary/15 border-tertiary/25 text-tertiary-dim'}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-secondary-dim' : 'bg-tertiary-dim'}`}
        style={{ boxShadow: isPresent ? '0 0 6px #22d3ee' : '0 0 6px #fb7185' }}
      />
      {isPresent ? 'Present' : 'Absent'}
    </span>
  )
}
