interface Props { label: string; value: string | number; accent?: 'mint' | 'rose' | 'indigo' | 'default' }

const accentMap = {
  mint:    'text-secondary-dim',
  rose:    'text-tertiary-dim',
  indigo:  'text-primary-dim',
  default: 'text-on-surface',
}

export default function StatPill({ label, value, accent = 'default' }: Props) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border border-white/[0.08]"
      style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <span className={`text-2xl font-headline font-bold ${accentMap[accent]}`}>{value}</span>
      <span className="text-[10px] font-label text-on-surface-variant/60 uppercase tracking-widest">{label}</span>
    </div>
  )
}
