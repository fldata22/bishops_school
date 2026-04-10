import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import { CaretLeft, BookOpen, CheckCircle, XCircle } from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default async function TeacherClassBreakdownPage({
  params,
}: {
  params: { id: string; classId: string }
}) {
  const teacherId = Number(params.id)
  const classId = Number(params.classId)
  if (!Number.isFinite(teacherId) || !Number.isFinite(classId)) notFound()

  let teacher, schoolClass
  try {
    ;[teacher, schoolClass] = await Promise.all([
      api.getTeacher(teacherId),
      api.getClass(classId),
    ])
  } catch {
    notFound()
  }

  // Sessions by this teacher for this class
  const sessionsList = await api.listSessions({
    teacher_id: teacherId,
    class_id: classId,
  })
  const sortedList = [...sessionsList].sort((a, b) => b.date.localeCompare(a.date))

  // Fetch full details (book, attendance records) for each session in parallel.
  const detailed = await Promise.all(sortedList.map(s => api.getSession(s.id)))

  // Also fetch the class sessions count for "share" KPI.
  const classSessionsAll = await api.listSessions({ class_id: classId })
  const totalClassSessions = classSessionsAll.length
  const teachingPct =
    totalClassSessions > 0
      ? Math.round((sortedList.length / totalClassSessions) * 100)
      : 0

  // Group by module
  const moduleMap = new Map<
    number,
    {
      module: { id: number; name: string; code: string }
      entries: Array<{
        sessionId: number
        present: number
        absent: number
        total: number
        rate: number
        date: string
        topic: string
      }>
    }
  >()

  for (const session of detailed) {
    const mod = session.module
    if (!mod) continue
    if (!moduleMap.has(mod.id)) {
      moduleMap.set(mod.id, {
        module: { id: mod.id, name: mod.name, code: mod.code },
        entries: [],
      })
    }
    const records = session.attendance_records ?? []
    const present = records.filter(r => r.status === 'present').length
    const total = records.length
    const rate = total > 0 ? Math.round((present / total) * 100) : 0
    const chapterName =
      session.book?.chapters?.[session.chapter_index] ??
      `Chapter ${session.chapter_index + 1}`
    const topic = session.book ? `${session.book.name} › ${chapterName}` : 'Unknown'
    moduleMap.get(mod.id)!.entries.push({
      sessionId: session.id,
      present,
      absent: total - present,
      total,
      rate,
      date: session.date,
      topic,
    })
  }

  const moduleGroups = Array.from(moduleMap.values()).map(group => {
    const avgRate =
      group.entries.length > 0
        ? Math.round(
            group.entries.reduce((s, e) => s + e.rate, 0) / group.entries.length
          )
        : 0
    return { ...group, avgRate }
  })

  // Overall stats
  const allRecords = detailed.flatMap(s => s.attendance_records ?? [])
  const overallPresent = allRecords.filter(r => r.status === 'present').length
  const overallTotal = allRecords.length
  const overallRate =
    overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 0
  const rateColor =
    overallRate >= 80
      ? 'text-secondary-dim'
      : overallRate >= 65
        ? 'text-primary-dim'
        : 'text-tertiary-dim'

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/teachers" className="inline-flex items-center gap-1.5 text-xs font-label text-on-surface-variant/60 hover:text-primary-dim transition-colors mb-6">
          <CaretLeft size={14} />
          Teachers
        </Link>

        {/* Hero */}
        <div className="flex items-center gap-5 mb-8">
          <div
            className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0"
            style={{ boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}
          >
            <Image
              src={`https://i.pravatar.cc/80?u=${teacher.id}`}
              alt={teacher.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-0.5">{schoolClass.name}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold font-headline tracking-tight text-on-surface">{teacher.name}</h1>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Sessions Taught</p>
            <p className="text-3xl font-black font-headline text-on-surface">{sortedList.length}</p>
            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">of {totalClassSessions} total</p>
          </div>
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Share</p>
            <p className="text-3xl font-black font-headline text-primary-dim">{teachingPct}%</p>
            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">of class sessions</p>
          </div>
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Avg Attendance</p>
            <p className={`text-3xl font-black font-headline ${rateColor}`}>{overallRate}%</p>
            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">student presence</p>
          </div>
        </div>

        {/* Module breakdowns */}
        <div className="space-y-6">
          {moduleGroups.length === 0 && (
            <p className="text-sm text-on-surface-variant/60 font-label">No sessions recorded yet.</p>
          )}
          {moduleGroups.map(({ module: mod, entries, avgRate }) => {
            const modRateColor = avgRate >= 80 ? 'text-secondary-dim' : avgRate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
            const barGradient = avgRate >= 80 ? 'from-secondary to-secondary-dim' : avgRate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
            return (
              <div
                key={mod.id}
                className="rounded-xl border border-white/[0.07] overflow-hidden"
                style={glassCard}
              >
                {/* Module header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                      style={{ boxShadow: '0 0 10px rgba(124,58,237,0.2)' }}>
                      <BookOpen size={16} className="text-primary-dim" />
                    </div>
                    <div>
                      <p className="font-bold text-sm font-headline text-on-surface">{mod.name}</p>
                      <p className="text-[10px] text-on-surface-variant/60 font-label">{mod.code} · {entries.length} session{entries.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {entries.length > 0 && (
                    <div className="text-right">
                      <p className={`text-lg font-black font-headline ${modRateColor}`}>{avgRate}%</p>
                      <p className="text-[10px] text-on-surface-variant/60 font-label">avg attendance</p>
                    </div>
                  )}
                </div>

                {/* Session rows */}
                <div className="divide-y divide-white/[0.04]">
                  {entries.map(({ sessionId, present, absent, rate, date, topic }) => {
                    const sRateColor = rate >= 80 ? 'text-secondary-dim' : rate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
                    const sBarGradient = rate >= 80 ? 'from-secondary to-secondary-dim' : rate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
                    const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    return (
                      <div key={sessionId} className="px-5 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-label font-medium text-on-surface truncate">{topic}</p>
                          <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">{displayDate}</p>
                          <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className={`h-full rounded-full bg-gradient-to-r ${sBarGradient}`} style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className={`text-base font-black font-headline ${sRateColor}`}>{rate}%</p>
                          <div className="flex items-center justify-end gap-2 mt-0.5">
                            <span className="flex items-center gap-0.5 text-[10px] text-secondary-dim font-label">
                              <CheckCircle size={10} weight="fill" /> {present}
                            </span>
                            <span className="flex items-center gap-0.5 text-[10px] text-tertiary-dim font-label">
                              <XCircle size={10} weight="fill" /> {absent}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Module progress bar */}
                {entries.length > 0 && (
                  <div className="px-5 py-3 border-t border-white/[0.04]">
                    <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${avgRate}%` }} />
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
