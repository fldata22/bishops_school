import { notFound } from 'next/navigation'
import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import {
  Seal,
  CheckCircle,
  XCircle,
  GraduationCap,
  ChartBar,
  Star,
} from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

function avatarFor(id: number, imageUrl: string | null, gender: string | null) {
  if (imageUrl) return imageUrl
  const g = gender === 'female' ? 'girl' : 'boy'
  return `https://avatar.iran.liara.run/public/${g}?username=${id}`
}

function participationLabel(avg: number | null): { label: string; avg: number } | null {
  if (avg === null) return null
  // Rubric maps level 1→0%, 2→25%, 3→50%, 4→75%. avg is the raw mean of
  // levels (1–4); convert to the rubric's pct scale.
  const pct = Math.round((avg - 1) * 25)
  const label =
    avg >= 3.5 ? 'Outstanding' :
    avg >= 2.5 ? 'Strong' :
    avg >= 1.5 ? 'Steady' :
                 'Needs coaching'
  return { label, avg: pct }
}

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const studentId = Number(params.id)
  if (!Number.isFinite(studentId)) notFound()

  let profile
  try {
    profile = await api.getStudentProfile(studentId)
  } catch {
    notFound()
  }

  const { student, attendance_rate: overallRate, present_count: totalPresent, absent_count: totalAbsent, module_breakdown, participation_average } = profile
  const totalSessions = totalPresent + totalAbsent
  const participation = participationLabel(participation_average)

  // Fetch the raw student for its image/gender fields so we can render the avatar.
  const rawStudent = await api.getStudent(studentId)

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* ── Desktop hero ── */}
        <section className="hidden md:grid grid-cols-12 gap-8 items-end mb-8">
          <div className="col-span-8 flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative group">
              <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-white/[0.1]"
                style={{ boxShadow: '0 12px 40px rgba(124,58,237,0.2)' }}>
                <Image
                  src={avatarFor(student.id, rawStudent.image, rawStudent.gender)}
                  alt={student.name}
                  width={192}
                  height={192}
                  unoptimized={!!rawStudent.image}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-3 -right-3 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg"
                style={{ boxShadow: '0 0 20px rgba(6,182,212,0.5)' }}
              >
                <Seal size={24} weight="fill" className="text-white" />
              </div>
            </div>
            <div className="text-center md:text-left space-y-2">
              <span className="text-primary-dim font-semibold tracking-wider text-xs uppercase font-label">Student Profile</span>
              <h1 className="text-4xl lg:text-5xl font-black font-headline tracking-tighter text-on-surface">{student.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                {[`${student.class}`, rawStudent.country].filter(Boolean).map((label, i) => (
                  <span key={i} className="text-on-surface-variant/60 text-xs font-label px-3 py-1 rounded-full border border-white/[0.07]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>{label}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Right: Total Attendance % */}
          <div className="col-span-4 flex flex-col items-end">
            <div className="p-6 rounded-xl border border-white/[0.07] w-full text-center md:text-right" style={glassCard}>
              <span className="text-on-surface-variant/60 text-sm font-label font-medium block mb-1">Total Attendance</span>
              <div className="text-6xl font-black font-headline text-secondary-dim tracking-tighter">{overallRate}%</div>
              <span className="text-secondary/70 text-xs font-semibold font-label">
                {totalPresent}/{totalSessions} sessions attended
              </span>
            </div>
          </div>
        </section>

        {/* ── Desktop stat bento grid ── */}
        <section className="hidden md:grid grid-cols-3 gap-4 mb-8">
          <div
            className="p-6 rounded-xl border border-white/[0.07] hover:border-white/[0.12] transition-colors"
            style={glassCard}
          >
            <div className="flex justify-between items-start mb-4">
              <CheckCircle size={30} className="text-secondary-dim" weight="fill" />
              <span className="text-secondary-dim font-bold text-lg font-headline">{totalPresent}</span>
            </div>
            <h3 className="text-on-surface-variant/60 text-sm font-label font-medium">Present</h3>
            <p className="text-xs text-on-surface-variant/50 font-label mt-1">{totalPresent} of {totalSessions} classes attended</p>
          </div>
          <div
            className="p-6 rounded-xl border border-white/[0.07] hover:border-white/[0.12] transition-colors"
            style={glassCard}
          >
            <div className="flex justify-between items-start mb-4">
              <XCircle size={30} className="text-tertiary-dim" weight="fill" />
              <span className="text-tertiary-dim font-bold text-lg font-headline">{totalAbsent}</span>
            </div>
            <h3 className="text-on-surface-variant/60 text-sm font-label font-medium">Absent</h3>
            <p className="text-xs text-on-surface-variant/50 font-label mt-1">{totalAbsent} of {totalSessions} classes missed</p>
          </div>
          <div
            className="p-6 rounded-xl border border-white/[0.07] hover:border-white/[0.12] transition-colors"
            style={glassCard}
          >
            <div className="flex justify-between items-start mb-4">
              <Star size={30} className="text-primary-dim" weight="fill" />
              {participation && <span className="text-primary-dim font-bold text-lg font-headline">{participation.avg}%</span>}
            </div>
            <h3 className="text-on-surface-variant/60 text-sm font-label font-medium">Participation</h3>
            <p className="text-xs text-on-surface-variant/50 font-label mt-1">{participation ? participation.label : 'No data yet'}</p>
          </div>
        </section>

        {/* ── Desktop Module Breakdown ── */}
        <div className="hidden md:grid grid-cols-1 gap-8 mb-8">
          <section className="col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline text-on-surface">Module Breakdown</h2>
              <span
                className="text-xs text-on-surface-variant/60 px-2 py-1 rounded font-label border border-white/[0.07]"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >{student.class}</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/[0.07]" style={glassCard}>
              <div className="divide-y divide-white/[0.04]">
                {module_breakdown.length === 0 && (
                  <p className="p-6 text-sm text-on-surface-variant/60 font-label">No module data yet.</p>
                )}
                {module_breakdown.map((mod, idx) => {
                  const rate = mod.rate
                  const iconColors = ['text-primary-dim bg-primary/10', 'text-secondary-dim bg-secondary/10', 'text-tertiary-dim bg-tertiary/10', 'text-on-surface-variant/60 bg-white/5']
                  const iconColor = iconColors[idx % iconColors.length]
                  const barGradient = rate >= 80 ? 'from-secondary to-secondary-dim' : rate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
                  const rateColor = rate >= 80 ? 'text-secondary-dim' : rate >= 65 ? 'text-on-surface' : 'text-tertiary-dim'
                  return (
                    <div key={mod.module_id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/[0.02] transition-all">
                      <div className="flex gap-4 items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface font-label">{mod.module_name}</h4>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 w-full sm:w-48">
                        <div className="flex justify-between w-full text-xs font-bold font-label">
                          <span className={rateColor}>{rate}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${rate}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>

        {/* ── Mobile hero ── */}
        <section className="md:hidden flex flex-col items-center text-center space-y-4 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full p-0.5 bg-gradient-to-br from-primary to-secondary">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-background">
                <Image
                  src={avatarFor(student.id, rawStudent.image, rawStudent.gender)}
                  alt={student.name}
                  width={128}
                  height={128}
                  unoptimized={!!rawStudent.image}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div
              className="absolute bottom-1 right-1 bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg"
              style={{ boxShadow: '0 0 12px rgba(6,182,212,0.5)' }}
            >
              <Seal size={12} weight="fill" className="text-white" />
              <span className="text-[10px] font-bold tracking-wider text-white">Verified</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">{student.name}</h2>
            <p className="text-on-surface-variant/60 font-label text-sm">{student.class} · {rawStudent.country ?? ''}</p>
          </div>
        </section>

        {/* ── Mobile stat grid ── */}
        <section className="md:hidden space-y-3 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-5 border border-secondary/20 flex flex-col space-y-2"
              style={{ background: 'rgba(6,182,212,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <span className="text-secondary-dim text-[12px] font-bold tracking-widest uppercase font-label">Present</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-headline font-bold text-on-surface">{totalPresent}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/60 font-label">{totalPresent}/{totalSessions} classes</p>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.2)' }}>
                <div className="h-full bg-secondary-dim rounded-full" style={{ width: `${overallRate}%` }} />
              </div>
            </div>
            <div className="rounded-xl p-5 border border-tertiary/20 flex flex-col space-y-2"
              style={{ background: 'rgba(244,63,94,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <span className="text-tertiary-dim text-[12px] font-bold tracking-widest uppercase font-label">Absent</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-headline font-bold text-on-surface">{totalAbsent}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/60 font-label">{totalAbsent}/{totalSessions} classes</p>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(244,63,94,0.2)' }}>
                <div className="h-full bg-tertiary-dim rounded-full" style={{ width: `${totalSessions > 0 ? Math.round((totalAbsent / totalSessions) * 100) : 0}%` }} />
              </div>
            </div>
          </div>
          <div className="rounded-xl p-5 border border-white/[0.07] flex items-center justify-between" style={glassCard}>
            <div className="flex items-center gap-3">
              <Star size={20} className="text-primary-dim" weight="fill" />
              <div>
                <span className="text-primary-dim text-[12px] font-bold tracking-widest uppercase font-label">Participation</span>
                <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">{participation ? participation.label : 'No data yet'}</p>
              </div>
            </div>
            {participation && <span className="text-2xl font-headline font-bold text-primary-dim">{participation.avg}%</span>}
          </div>
        </section>

        {/* ── Mobile module breakdown ── */}
        <section className="md:hidden space-y-4 mb-8">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2 text-on-surface">
            <ChartBar size={20} className="text-primary-dim" />
            Module Breakdown
          </h3>
          <div className="rounded-xl p-6 space-y-6 border border-white/[0.07]" style={glassCard}>
            {module_breakdown.length === 0 && (
              <p className="text-sm text-on-surface-variant/60 font-label">No module data yet.</p>
            )}
            {module_breakdown.map(mod => {
              const rate = mod.rate
              const rateColor = rate >= 80 ? 'text-secondary-dim' : rate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
              const barGradient = rate >= 80 ? 'from-secondary to-secondary-dim' : rate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
              return (
                <div key={mod.module_id} className="space-y-2">
                  <div className="flex justify-between text-sm font-label font-medium">
                    <span className="text-on-surface truncate max-w-[60%]">{mod.module_name}</span>
                    <span className={rateColor}>{rate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${rate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </PrincipalShell>
  )
}
