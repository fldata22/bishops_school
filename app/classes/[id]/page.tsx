import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import { CaretLeft, CaretRight, Users, BookOpen } from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const classId = Number(params.id)
  if (!Number.isFinite(classId)) notFound()

  let schoolClass
  try {
    schoolClass = await api.getClass(classId)
  } catch {
    notFound()
  }

  const [students, sessions, modules, teachers] = await Promise.all([
    api.listStudents({ class_id: classId }),
    api.listSessions({ class_id: classId }),
    api.listModules(),
    api.listTeachers(),
  ])

  const teacherName = teachers.find(t => t.id === schoolClass.teacher_id)?.name ?? '—'

  // For each module, compute completion within this class
  const moduleProgress = modules.map(mod => {
    const totalChapters = mod.books.reduce((sum, b) => sum + b.chapters.length, 0)
    const moduleSessions = sessions.filter(s => s.module_id === mod.id)
    // Distinct (book_id, chapter_index) pairs taught
    const taughtKeys = new Set(moduleSessions.map(s => `${s.book_id}:${s.chapter_index}`))
    const taught = taughtKeys.size
    const completionRate = totalChapters > 0 ? Math.round((taught / totalChapters) * 100) : 0
    return {
      module: mod,
      totalChapters,
      taught,
      completionRate,
      sessionCount: moduleSessions.length,
    }
  })

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-5xl mx-auto">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-label text-on-surface-variant/60 hover:text-primary-dim transition-colors mb-6"
        >
          <CaretLeft size={14} />
          Classes
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">Class</p>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-on-surface">{schoolClass.name}</h1>
          <p className="text-sm text-on-surface-variant/60 font-label mt-1">Teacher: {teacherName}</p>
        </div>

        {/* Module Progress */}
        <section className="mb-10">
          <h2 className="text-lg font-bold font-headline text-on-surface mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary-dim" />
            Module Progress
          </h2>
          <div className="space-y-2">
            {moduleProgress.map(({ module: mod, totalChapters, taught, completionRate, sessionCount }) => {
              const rateColor = completionRate >= 80 ? 'text-secondary-dim' : completionRate >= 40 ? 'text-primary-dim' : 'text-on-surface-variant/60'
              const barGradient = completionRate >= 80 ? 'from-secondary to-secondary-dim' : completionRate >= 40 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
              return (
                <Link
                  key={mod.id}
                  href={`/classes/${classId}/modules/${mod.id}`}
                  className="block rounded-xl p-4 border border-white/[0.07] hover:border-white/[0.12] transition-colors"
                  style={glassCard}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] font-label font-bold text-primary-dim bg-primary/10 border border-primary/20 rounded px-2 py-0.5 shrink-0">
                        {mod.code}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-on-surface text-sm truncate">{mod.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60 font-label">
                          {taught}/{totalChapters} chapters · {sessionCount} session{sessionCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-base font-black font-headline ${rateColor}`}>{completionRate}%</span>
                      <CaretRight size={14} className="text-on-surface-variant/40" />
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${completionRate}%` }} />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Student list */}
        <section>
          <h2 className="text-lg font-bold font-headline text-on-surface mb-4 flex items-center gap-2">
            <Users size={18} className="text-primary-dim" />
            Students
            <span className="text-xs font-label text-on-surface-variant/60 px-2 py-0.5 rounded-full border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {students.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {students.length === 0 && (
              <p className="text-sm text-on-surface-variant/60 font-label">No students in this class.</p>
            )}
            {students.map(s => (
              <Link
                key={s.id}
                href={`/students/${s.id}`}
                className="block rounded-xl p-4 border border-white/[0.07] hover:border-white/[0.12] transition-colors"
                style={glassCard}
              >
                <p className="font-semibold text-on-surface text-sm truncate">{s.name}</p>
                <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">
                  {s.country ?? '—'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PrincipalShell>
  )
}
