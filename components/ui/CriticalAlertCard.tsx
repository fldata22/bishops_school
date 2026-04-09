import type { CriticalAlert } from '@/lib/types'
import { Warning } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function CriticalAlertCard({ alert }: { alert: CriticalAlert }) {
  return (
    <Link href={`/students/${alert.studentId}`}
      className="flex items-center gap-3 p-3 rounded-xl border-l-2 border-tertiary transition-colors duration-200 group"
      style={{ background: 'rgba(244,63,94,0.05)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.05)')}
    >
      <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0"
        style={{ boxShadow: '0 0 12px rgba(244,63,94,0.3)' }}>
        <Warning size={16} weight="fill" className="text-tertiary-dim" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-label font-semibold text-on-surface truncate">{alert.studentName}</p>
        <p className="text-xs font-label text-on-surface-variant/60 truncate">{alert.className}</p>
      </div>
      <span className="text-sm font-headline font-bold text-tertiary-dim shrink-0">{alert.consecutiveAbsences}x</span>
    </Link>
  )
}
