'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CaretDown } from '@phosphor-icons/react'
import type { ApiStudent } from '@/lib/api-types'
import { teacherAvatar } from '@/lib/teacher-avatars'

interface ClassGroup {
  classId: number
  className: string
  students: ApiStudent[]
}

interface TeacherGroup {
  teacherId: number
  teacherName: string
  totalStudents: number
  classes: ClassGroup[]
}

interface Props { teacherGroups: TeacherGroup[] }

function getStudentAvatarUrl(student: { id: number; image: string | null; gender: string | null }) {
  if (student.image) return student.image
  const gender = student.gender === 'female' ? 'girl' : 'boy'
  return `https://avatar.iran.liara.run/public/${gender}?username=${student.id}`
}

function ClassAccordion({ group }: { group: ClassGroup }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl border border-white/[0.06] overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-primary-dim font-headline">{group.className[0]}</span>
        </div>
        <span className="flex-1 min-w-0 text-sm font-bold font-headline text-on-surface truncate">{group.className}</span>
        <span className="text-xs font-label text-on-surface-variant/50 shrink-0 mr-2">{group.students.length}</span>
        <CaretDown
          size={14}
          weight="bold"
          className={`text-on-surface-variant/40 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-white/[0.05] p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {group.students.map(student => (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-white/[0.05] hover:border-white/[0.12] transition-colors group"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                  <Image
                    src={getStudentAvatarUrl(student)}
                    alt={student.name}
                    width={32}
                    height={32}
                    unoptimized={!!student.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm truncate group-hover:text-primary-dim transition-colors">{student.name}</p>
                  <p className="text-[11px] text-on-surface-variant/50 font-label truncate">{student.country ?? '—'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function StudentClassGroups({ teacherGroups }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  function toggle(teacherId: number) {
    setExpanded(prev => ({ ...prev, [teacherId]: !prev[teacherId] }))
  }

  return (
    <div className="space-y-4">
      {teacherGroups.map(tg => {
        const isOpen = !!expanded[tg.teacherId]
        return (
          <section
            key={tg.teacherId}
            className="rounded-2xl border border-white/[0.07] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            {/* Teacher header */}
            <button
              onClick={() => toggle(tg.teacherId)}
              className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20"
                style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}
              >
                <Image
                  src={teacherAvatar({ id: tg.teacherId, name: tg.teacherName })}
                  alt={tg.teacherName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-bold font-headline text-on-surface truncate">{tg.teacherName}</h2>
                <p className="text-xs text-on-surface-variant/60 font-label">
                  {tg.totalStudents} student{tg.totalStudents !== 1 ? 's' : ''} · {tg.classes.length} class{tg.classes.length !== 1 ? 'es' : ''}
                </p>
              </div>
              <CaretDown
                size={16}
                weight="bold"
                className={`text-on-surface-variant/40 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Classes within teacher */}
            {isOpen && (
              <div className="border-t border-white/[0.06] p-3 md:p-4 flex flex-col gap-2">
                {tg.classes.map(cls => (
                  <ClassAccordion key={cls.classId} group={cls} />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
