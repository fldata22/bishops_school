import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getTeacherById, getClassById, getModuleById,
  getSessionsByTeacher, getSessionsByClass,
  getAttendanceForSession, getTeacherModuleAssignments,
} from '@/lib/mock-data'
import { CaretLeft, BookOpen, CheckCircle, XCircle } from '@phosphor-icons/react/dist/ssr'

export default function TeacherClassBreakdownPage({ params }: { params: { id: string; classId: string } }) {
  const teacher = getTeacherById(params.id)
  const cls = getClassById(params.classId)
  if (!teacher || !cls) notFound()

  // Sessions taught by this teacher for this class
  const teacherClassSessions = getSessionsByTeacher(params.id)
    .filter(s => s.classId === params.classId)
    .sort((a, b) => b.date.localeCompare(a.date))

  const totalClassSessions = getSessionsByClass(params.classId).length
  const teachingPct = totalClassSessions > 0
    ? Math.round((teacherClassSessions.length / totalClassSessions) * 100)
    : 0

  // Assigned modules for this teacher+class
  const assignedModuleIds = getTeacherModuleAssignments()
    .filter(a => a.teacherId === params.id && a.classId === params.classId)
    .map(a => a.moduleId)

  // Group sessions by module
  const moduleGroups = assignedModuleIds.map(moduleId => {
    const mod = getModuleById(moduleId)!
    const sessions = teacherClassSessions.filter(s => s.moduleId === moduleId)
    const enriched = sessions.map(session => {
      const att = getAttendanceForSession(session.id)
      const present = att.filter(a => a.status === 'present').length
      const total = att.length
      const rate = total > 0 ? Math.round((present / total) * 100) : 0
      const topic = session.topicIndex < mod.topics.length ? mod.topics[session.topicIndex] : `Topic ${session.topicIndex + 1}`
      return { session, present, total, rate, topic }
    })
    const avgRate = enriched.length > 0
      ? Math.round(enriched.reduce((s, e) => s + e.rate, 0) / enriched.length)
      : 0
    return { mod, enriched, avgRate }
  })

  // Overall attendance across all sessions
  const allAtt = teacherClassSessions.flatMap(s => getAttendanceForSession(s.id))
  const overallPresent = allAtt.filter(a => a.status === 'present').length
  const overallTotal = allAtt.length
  const overallRate = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 0
  const rateColor = overallRate >= 80 ? 'text-secondary' : overallRate >= 65 ? 'text-primary' : 'text-error'

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/teachers" className="inline-flex items-center gap-1.5 text-xs font-label text-on-surface-variant hover:text-primary transition-colors mb-6">
          <CaretLeft size={14} />
          Teachers
        </Link>

        {/* Hero */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-primary/20 ring-2 ring-primary/10 shrink-0">
            <Image
              src={`https://i.pravatar.cc/80?u=${teacher.id}`}
              alt={teacher.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-0.5">{cls.name} Class</p>
            <h1 className="text-2xl md:text-3xl font-extrabold font-headline tracking-tight">{teacher.name}</h1>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label mb-1">Sessions Taught</p>
            <p className="text-3xl font-black font-headline">{teacherClassSessions.length}</p>
            <p className="text-[10px] text-on-surface-variant font-label mt-0.5">of {totalClassSessions} total</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label mb-1">Share</p>
            <p className="text-3xl font-black font-headline text-primary">{teachingPct}%</p>
            <p className="text-[10px] text-on-surface-variant font-label mt-0.5">of class sessions</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label mb-1">Avg Attendance</p>
            <p className={`text-3xl font-black font-headline ${rateColor}`}>{overallRate}%</p>
            <p className="text-[10px] text-on-surface-variant font-label mt-0.5">student presence</p>
          </div>
        </div>

        {/* Module breakdowns */}
        <div className="space-y-6">
          {moduleGroups.map(({ mod, enriched, avgRate }) => {
            const modRateColor = avgRate >= 80 ? 'text-secondary' : avgRate >= 65 ? 'text-primary' : 'text-error'
            const barColor = avgRate >= 80 ? 'bg-secondary' : avgRate >= 65 ? 'bg-primary' : 'bg-error'
            return (
              <div key={mod.id} className="rounded-xl border border-outline-variant/10 overflow-hidden"
                style={{ background: 'rgba(25,37,64,0.4)', backdropFilter: 'blur(12px)' }}>

                {/* Module header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm font-headline">{mod.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-label">{mod.code} · {enriched.length} session{enriched.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {enriched.length > 0 && (
                    <div className="text-right">
                      <p className={`text-lg font-black font-headline ${modRateColor}`}>{avgRate}%</p>
                      <p className="text-[10px] text-on-surface-variant font-label">avg attendance</p>
                    </div>
                  )}
                </div>

                {/* Session rows */}
                {enriched.length === 0 ? (
                  <p className="px-5 py-4 text-xs font-label text-on-surface-variant">No sessions recorded yet.</p>
                ) : (
                  <div className="divide-y divide-outline-variant/5">
                    {enriched.map(({ session, present, total, rate, topic }) => {
                      const sRateColor = rate >= 80 ? 'text-secondary' : rate >= 65 ? 'text-primary' : 'text-error'
                      const sBarColor = rate >= 80 ? 'bg-secondary' : rate >= 65 ? 'bg-primary' : 'bg-error'
                      const date = new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      return (
                        <div key={session.id} className="px-5 py-4 flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-label font-medium text-on-surface truncate">{topic}</p>
                            <p className="text-[10px] text-on-surface-variant font-label mt-0.5">{date}</p>
                            <div className="mt-2 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${sBarColor}`} style={{ width: `${rate}%` }} />
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className={`text-base font-black font-headline ${sRateColor}`}>{rate}%</p>
                            <div className="flex items-center justify-end gap-2 mt-0.5">
                              <span className="flex items-center gap-0.5 text-[10px] text-secondary font-label">
                                <CheckCircle size={10} weight="fill" /> {present}
                              </span>
                              <span className="flex items-center gap-0.5 text-[10px] text-error font-label">
                                <XCircle size={10} weight="fill" /> {total - present}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Module progress bar */}
                {enriched.length > 0 && (
                  <div className="px-5 py-3 border-t border-outline-variant/5">
                    <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${avgRate}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </PrincipalShell>
  )
}
