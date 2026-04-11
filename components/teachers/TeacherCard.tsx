'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CaretDown, Spinner } from '@phosphor-icons/react'
import { teacherAvatar } from '@/lib/teacher-avatars'
import { api } from '@/lib/api'
import type { ApiStudent } from '@/lib/api-types'

interface ClassChip {
  id: number
  name: string
}

function ClassesSection({ classes }: { classes: ClassChip[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label">
          Classes
        </p>
        <CaretDown
          size={12}
          weight="bold"
          className={`text-on-surface-variant/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-1.5">
          {classes.map(cls => (
            <ClassAccordionItem key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  )
}

function ClassAccordionItem({ cls }: { cls: ClassChip }) {
  const [open, setOpen] = useState(false)
  const [students, setStudents] = useState<ApiStudent[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (!open && students === null) {
      setLoading(true)
      try {
        const data = await api.listStudents({ class_id: cls.id })
        setStudents(data)
      } finally {
        setLoading(false)
      }
    }
    setOpen(v => !v)
  }

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-xs font-bold font-label text-on-surface">{cls.name}</span>
        {loading
          ? <Spinner size={14} className="text-on-surface-variant/50 animate-spin" />
          : <CaretDown size={14} weight="bold" className={`text-on-surface-variant/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        }
      </button>

      {open && students !== null && (
        <div className="border-t border-white/[0.06] px-3 py-2 flex flex-col gap-0.5">
          {students.length === 0 && (
            <p className="text-[11px] text-on-surface-variant/50 font-label py-1">No students enrolled</p>
          )}
          {students.map(s => (
            <Link
              key={s.id}
              href={`/students/${s.id}`}
              className="text-[11px] font-label text-on-surface-variant hover:text-primary-dim py-1 px-1 rounded hover:bg-primary/10 transition-colors"
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
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
  const [open, setOpen] = useState(false)

  const rateColor = attendanceRate >= 80 ? 'text-secondary-dim' : attendanceRate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
  const barGradient = attendanceRate >= 80 ? 'from-secondary to-secondary-dim' : attendanceRate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'

  return (
    <div
      className="rounded-2xl border border-white/[0.07] overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      {/* Collapsed header — name + picture only, clickable */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20"
          style={{ boxShadow: '0 0 16px rgba(124,58,237,0.2)' }}
        >
          <Image
            src={teacherAvatar(teacher)}
            alt={teacher.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="flex-1 min-w-0 font-bold text-on-surface font-headline truncate">{teacher.name}</p>
        <CaretDown
          size={18}
          weight="bold"
          className={`text-on-surface-variant/50 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-white/[0.06] px-5 pb-6 pt-4 flex flex-col gap-5">
          {/* Classes accordion */}
          {classes.length > 0 && (
            <ClassesSection classes={classes} />
          )}

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
          </div>
        </div>
      )}
    </div>
  )
}
