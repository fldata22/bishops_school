'use client'
import Image from 'next/image'
import Link from 'next/link'
import type { Teacher, Class } from '@/lib/types'

interface Props {
  teacher: Teacher
  classes: Class[]
  sessions: number
  sessionsThisMonth: number
  attendanceRate: number
  sessionPct: number
}

export default function TeacherCard({ teacher, classes, sessions, sessionsThisMonth, attendanceRate, sessionPct }: Props) {
  const rateColor = attendanceRate >= 80 ? 'text-secondary' : attendanceRate >= 65 ? 'text-primary' : 'text-error'
  const barColor = attendanceRate >= 80 ? 'bg-secondary' : attendanceRate >= 65 ? 'bg-primary' : 'bg-error'

  return (
    <div
      className="p-6 rounded-2xl border border-white/5 flex flex-col gap-6"
      style={{ background: 'rgba(25,37,64,0.4)', backdropFilter: 'blur(12px)' }}
    >
      {/* Top row: avatar + name + class chips */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-primary/20 shrink-0 ring-2 ring-primary/10">
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
                className="px-2 py-0.5 rounded-full text-[10px] font-bold font-label bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all duration-150"
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">Sessions</span>
          <span className="text-2xl font-black font-headline">{sessions}</span>
          <span className="text-[10px] text-on-surface-variant font-label">total</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">This Month</span>
          <span className="text-2xl font-black font-headline">{sessionsThisMonth}</span>
          <span className="text-[10px] text-on-surface-variant font-label">sessions</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">Avg Attend.</span>
          <span className={`text-2xl font-black font-headline ${rateColor}`}>{attendanceRate}%</span>
          <span className="text-[10px] text-on-surface-variant font-label">student rate</span>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold font-label uppercase tracking-widest text-on-surface-variant">
          <span>% of sessions taught</span>
          <span>{sessionPct}%</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${sessionPct}%` }} />
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary/70 rounded-full" style={{ width: `${attendanceRate}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-on-surface-variant font-label">
          <span>Attendance rate in their sessions</span>
          <span>{attendanceRate}%</span>
        </div>
      </div>
    </div>
  )
}
