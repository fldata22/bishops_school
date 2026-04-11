import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default async function ClassAttendancePage({ params }: { params: { id: string } }) {
  const classId = Number(params.id)
  if (!Number.isFinite(classId)) notFound()

  let schoolClass
  try {
    schoolClass = await api.getClass(classId)
  } catch {
    notFound()
  }

  const students = await api.listStudents({ class_id: classId })

  // Fetch attendance rate for each student in parallel
  const profiles = await Promise.all(
    students.map(async s => {
      try {
        const profile = await api.getStudentProfile(s.id)
        return {
          id: s.id,
          name: s.name,
          country: s.country,
          rate: profile.attendance_rate,
          present: profile.present_count,
          absent: profile.absent_count,
        }
      } catch {
        return {
          id: s.id,
          name: s.name,
          country: s.country,
          rate: 0,
          present: 0,
          absent: 0,
        }
      }
    })
  )

  // Sort by rate descending
  profiles.sort((a, b) => b.rate - a.rate)

  const avgRate = profiles.length > 0
    ? Math.round(profiles.reduce((acc, p) => acc + p.rate, 0) / profiles.length)
    : 0

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-4xl mx-auto">
        <Link
          href="/attendance"
          className="inline-flex items-center gap-1.5 text-xs font-label text-on-surface-variant/60 hover:text-primary-dim transition-colors mb-6"
        >
          <CaretLeft size={14} />
          Attendance
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">Class</p>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-on-surface">{schoolClass.name}</h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Students</p>
            <p className="text-3xl font-black font-headline text-on-surface">{profiles.length}</p>
          </div>
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Avg Attendance</p>
            <p className="text-3xl font-black font-headline text-secondary-dim">{avgRate}%</p>
          </div>
        </div>

        {/* Student list with attendance rates */}
        <h2 className="text-lg font-bold font-headline text-on-surface mb-4">Student Attendance</h2>
        <div className="space-y-2">
          {profiles.length === 0 && (
            <p className="text-sm text-on-surface-variant/60 font-label">No students in this class.</p>
          )}
          {profiles.map(p => {
            const rateColor = p.rate >= 80 ? 'text-secondary-dim' : p.rate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
            const barGradient = p.rate >= 80 ? 'from-secondary to-secondary-dim' : p.rate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
            const totalSessions = p.present + p.absent
            return (
              <Link
                key={p.id}
                href={`/students/${p.id}`}
                className="block rounded-xl p-4 border border-white/[0.07] hover:border-white/[0.12] transition-colors"
                style={glassCard}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm truncate">{p.name}</p>
                    <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">
                      {totalSessions > 0 ? `${p.present}/${totalSessions} sessions attended` : 'No sessions yet'}
                      {p.country ? ` · ${p.country}` : ''}
                    </p>
                  </div>
                  <span className={`text-lg font-black font-headline ${rateColor} shrink-0`}>{p.rate}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${p.rate}%` }} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </PrincipalShell>
  )
}
