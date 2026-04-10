'use client'
import Image from 'next/image'
import Link from 'next/link'

interface ClassChip {
  id: number
  name: string
}

interface Props {
  teacher: { id: number; name: string }
  classes: ClassChip[]
  sessions: number
  sessionsThisMonth: number
  attendanceRate: number
  sessionPct: number
}

export default function TeacherCard({ teacher, classes, sessions, sessionsThisMonth, attendanceRate, sessionPct }: Props) {
  const rateColor = attendanceRate >= 80 ? 'text-secondary-dim' : attendanceRate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
  const barGradient = attendanceRate >= 80 ? 'from-secondary to-secondary-dim' : attendanceRate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'

  return (
    <div
      className="p-6 rounded-2xl border border-white/[0.07] flex flex-col gap-6 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      {/* Shimmer top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Top row: avatar + name + class chips */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20"
          style={{ boxShadow: '0 0 16px rgba(124,58,237,0.2)' }}
        >
          <Image
            src={`https://i.pravatar.cc/80?u=${teacher.id}`}
            alt={teacher.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-on-surface font-headline truncate">{teacher.name}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {classes.map(cls => (
              <Link
                key={cls.id}
                href={`/teachers/${teacher.id}/${cls.id}`}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold font-label bg-primary/10 text-primary-dim border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all duration-150"
              >
                {cls.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label">Sessions</span>
          <span className="text-2xl font-black font-headline text-on-surface">{sessions}</span>
          <span className="text-[10px] text-on-surface-variant/60 font-label">total</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label">This Month</span>
          <span className="text-2xl font-black font-headline text-on-surface">{sessionsThisMonth}</span>
          <span className="text-[10px] text-on-surface-variant/60 font-label">sessions</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label">Avg Attend.</span>
          <span className={`text-2xl font-black font-headline ${rateColor}`}>{attendanceRate}%</span>
          <span className="text-[10px] text-on-surface-variant/60 font-label">student rate</span>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold font-label uppercase tracking-widest text-on-surface-variant/60">
          <span>% of sessions taught</span>
          <span>{sessionPct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${sessionPct}%` }} />
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full bg-gradient-to-r from-primary/70 to-primary-dim rounded-full" style={{ width: `${attendanceRate}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-on-surface-variant/60 font-label">
          <span>Attendance rate in their sessions</span>
          <span>{attendanceRate}%</span>
        </div>
      </div>
    </div>
  )
}
