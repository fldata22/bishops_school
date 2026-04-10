'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ApiStudent } from '@/lib/api-types'

interface ClassGroup {
  classId: number
  className: string
  teacherName: string
  students: ApiStudent[]
}

interface Props { groups: ClassGroup[] }

function getStudentAvatarUrl(student: { id: number; image: string | null; gender: string | null }) {
  if (student.image) return student.image
  const gender = student.gender === 'female' ? 'girl' : 'boy'
  return `https://avatar.iran.liara.run/public/${gender}?username=${student.id}`
}

export default function StudentClassGroups({ groups }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  function toggle(classId: number) {
    setExpanded(prev => ({ ...prev, [classId]: !prev[classId] }))
  }

  return (
    <div className="space-y-3">
      {groups.map(group => {
        const isOpen = !!expanded[group.classId]
        return (
          <section
            key={group.classId}
            className="rounded-2xl border border-white/[0.07] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            {/* Class header — clickable */}
            <button
              onClick={() => toggle(group.classId)}
              className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div
                className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}
              >
                <span className="text-sm font-black text-primary-dim font-headline">{group.className[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-bold font-headline text-on-surface truncate">{group.className}</h2>
                <p className="text-xs text-on-surface-variant/60 font-label truncate">{group.teacherName}</p>
              </div>
              <span
                className="text-xs font-label text-on-surface-variant/60 px-2.5 py-1 rounded-full border border-white/[0.07] shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {group.students.length} students
              </span>
              <span className="text-on-surface-variant/40 text-sm shrink-0">{isOpen ? '▾' : '▸'}</span>
            </button>

            {/* Student grid — only when expanded */}
            {isOpen && (
              <div className="border-t border-white/[0.06] p-4 md:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.students.map(student => (
                    <Link
                      key={student.id}
                      href={`/students/${student.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors group"
                      style={{ background: 'rgba(255,255,255,0.025)' }}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                        <Image
                          src={getStudentAvatarUrl(student)}
                          alt={student.name}
                          width={40}
                          height={40}
                          unoptimized={!!student.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface text-sm truncate group-hover:text-primary-dim transition-colors">{student.name}</p>
                        <p className="text-xs text-on-surface-variant/60 font-label truncate">{student.country ?? '—'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
