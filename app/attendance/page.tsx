import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import Link from 'next/link'
import { api } from '@/lib/api'
import ProgressNebula from '@/components/ui/ProgressNebula'
import { TrendUp, WarningCircle, EnvelopeSimple, Plus } from '@phosphor-icons/react/dist/ssr'

function presenceBadgeClass(rate: number) {
  if (rate >= 80) return {
    badge: 'bg-secondary/10 text-secondary-dim ring-secondary/20',
    bar: 'bg-gradient-to-r from-secondary to-secondary-dim',
    glow: '0 0 8px rgba(34,211,238,0.3)',
    barWidth: `${rate}%`,
  }
  if (rate >= 65) return {
    badge: 'bg-primary/10 text-primary-dim ring-primary/20',
    bar: 'bg-gradient-to-r from-primary to-primary-dim',
    glow: '0 0 8px rgba(167,139,250,0.3)',
    barWidth: `${rate}%`,
  }
  return {
    badge: 'bg-tertiary/10 text-tertiary-dim ring-tertiary/20',
    bar: 'bg-gradient-to-r from-tertiary to-tertiary-dim',
    glow: '0 0 8px rgba(251,113,133,0.3)',
    barWidth: `${rate}%`,
  }
}

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

const glassRow = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}

function avatarFor(id: number) {
  return `https://i.pravatar.cc/80?u=${id}`
}

export default async function AttendancePage() {
  const overview = await api.getAttendanceOverview()

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const activeModules = overview.module_attendance.filter(m => m.sessions > 0)

  const kpis = [
    { label: 'Total Students', value: overview.total_students, secondary: null, glowBg: 'rgba(124,58,237,0.08)', bar: 'from-primary to-primary-dim', barWidth: '100%' },
    { label: 'Present Today', value: overview.present_today, secondary: `${overview.overall_rate}%`, glowBg: 'rgba(6,182,212,0.08)', bar: 'from-secondary to-secondary-dim', barWidth: `${overview.overall_rate}%` },
    { label: 'Absent', value: overview.absent_today, secondary: null, glowBg: 'rgba(244,63,94,0.06)', bar: 'from-tertiary to-tertiary-dim', barWidth: `${Math.round((overview.absent_today / Math.max(overview.total_students, 1)) * 100)}%` },
    { label: 'Teachers', value: overview.teacher_count, secondary: null, glowBg: 'rgba(244,63,94,0.06)', bar: 'from-tertiary/70 to-tertiary-dim', barWidth: '100%' },
  ]

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto space-y-10">

        {/* Hero header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Attendance Overview</h2>
            <p className="text-on-surface-variant/60 font-label text-sm">Academic Quarter: Q3 · Today is {today}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/attend"
              className="px-6 py-2.5 rounded-full font-label font-bold text-sm text-white hover:opacity-90 hover:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124,58,237,0.35)' }}
            >
              Take Attendance
            </Link>
          </div>
        </div>

        {/* Mobile hero card */}
        <section className="md:hidden relative overflow-hidden p-8 rounded-3xl border border-white/[0.07]" style={glassCard}>
          <div className="absolute -top-12 -right-12 w-48 h-48 blur-[64px] rounded-full" style={{ background: 'rgba(124,58,237,0.15)' }} />
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-label text-on-surface-variant/60 uppercase tracking-[0.2em] text-[10px] mb-2 font-semibold">Overall Attendance</span>
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-extrabold tracking-tighter text-primary-dim font-headline">{overview.overall_rate}</span>
              <span className="text-3xl font-bold text-primary/60 font-headline">%</span>
            </div>
            <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
              <TrendUp size={14} className="text-secondary-dim" />
              <span className="text-secondary-dim font-medium text-xs font-label">Live snapshot</span>
            </div>
          </div>
        </section>

        {/* KPI Grid — desktop only */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-5 md:p-6 relative overflow-hidden border border-white/[0.07]" style={glassCard}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl" style={{ background: kpi.glowBg }} />
              <p className="text-on-surface-variant/60 text-[10px] font-bold uppercase tracking-widest mb-4 font-label">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black font-headline text-on-surface">{kpi.value}</span>
                {kpi.secondary && <span className="text-on-surface-variant/60 text-sm font-label">{kpi.secondary}</span>}
              </div>
              <div className="mt-5 w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className={`h-full rounded-full bg-gradient-to-r ${kpi.bar}`} style={{ width: kpi.barWidth }} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile critical alerts */}
        <section className="md:hidden space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-headline flex items-center gap-2">
              <WarningCircle size={20} className="text-tertiary-dim" weight="fill" />
              Critical Alerts
            </h2>
            <span className="text-xs font-medium text-tertiary-dim bg-tertiary/10 px-2.5 py-1 rounded-md font-label border border-tertiary/20">{overview.critical_alerts.length} Actions Needed</span>
          </div>
          <div className="space-y-3">
            {overview.critical_alerts.map(a => (
              <Link key={`mob-${a.student_id}`} href={`/students/${a.student_id}`}
                className="p-4 rounded-2xl flex items-center gap-4 border-l-4 border-tertiary transition-colors border border-tertiary/20"
                style={{ background: 'rgba(244,63,94,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-tertiary/20 shrink-0">
                  <Image src={avatarFor(a.student_id)} alt={a.student_name} width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold text-sm text-on-surface">{a.student_name}</h4>
                  <p className="text-xs text-on-surface-variant/60 font-label">{a.consecutive_absences} consecutive absences · {a.class_name}</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-tertiary/10 text-tertiary-dim shrink-0">
                  <EnvelopeSimple size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mobile class cards */}
        <section className="md:hidden space-y-4">
          <h2 className="text-lg font-bold font-headline text-on-surface">Class Attendance</h2>
          <div className="space-y-4">
            {overview.class_attendance.map(cls => {
              const { bar } = presenceBadgeClass(cls.rate)
              const statusLabel = cls.rate >= 80 ? 'High Stability' : cls.rate >= 65 ? 'Attention Required' : 'Critical'
              const statusColor = cls.rate >= 80 ? 'text-secondary-dim' : cls.rate >= 65 ? 'text-on-surface' : 'text-tertiary-dim'
              return (
                <div key={`mob-${cls.class_id}`}
                  className="block p-5 rounded-3xl border border-white/[0.07] relative overflow-hidden group"
                  style={glassCard}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl" style={{ background: 'rgba(124,58,237,0.06)' }} />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-on-surface font-headline">{cls.class_name}</h3>
                      <p className="text-xs text-on-surface-variant/60 font-label">{cls.sessions_this_month} sessions this month</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xl font-bold font-headline ${statusColor}`}>{cls.rate}%</span>
                      <span className="text-[10px] text-on-surface-variant/60 font-label">{statusLabel}</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2 relative z-10">
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${cls.rate}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-on-surface-variant/60 font-label">
                      <span>{cls.present}/{cls.total} Students Present</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Mobile module attendance */}
        <section className="md:hidden space-y-4">
          <h2 className="text-lg font-bold font-headline text-on-surface">Module Attendance</h2>
          <div className="space-y-4">
            {activeModules.map(mod => {
              const { bar } = presenceBadgeClass(mod.rate)
              const statusColor = mod.rate >= 80 ? 'text-secondary-dim' : mod.rate >= 65 ? 'text-on-surface' : 'text-tertiary-dim'
              return (
                <div key={`mob-mod-${mod.module_id}`}
                  className="block p-5 rounded-3xl border border-white/[0.07] relative overflow-hidden"
                  style={glassCard}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl" style={{ background: 'rgba(6,182,212,0.05)' }} />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-label text-secondary-dim">{mod.code}</span>
                      <h3 className="text-base font-bold text-on-surface font-headline">{mod.module_name}</h3>
                      <p className="text-xs text-on-surface-variant/60 font-label">{mod.sessions} sessions · {mod.topics} chapters</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xl font-bold font-headline ${statusColor}`}>{mod.rate}%</span>
                      <span className="text-[10px] text-on-surface-variant/60 font-label">Attendance</span>
                    </div>
                  </div>
                  <div className="mt-4 relative z-10">
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${mod.rate}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Secondary grid: classes + alerts — desktop only */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Class rows (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline text-on-surface">Class Attendance</h3>
              <Link href="/courses" className="text-primary-dim text-sm font-label font-medium hover:underline">View Modules</Link>
            </div>
            <div className="space-y-4">
              {overview.class_attendance.map(cls => {
                const { badge, bar, barWidth } = presenceBadgeClass(cls.rate)
                const timeLabel = `${cls.total} students · ${cls.sessions_this_month} sessions this month`
                return (
                  <div key={cls.class_id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6 rounded-xl border border-white/[0.07]"
                    style={glassRow}>
                    <div className="flex items-center gap-5">
                      <div
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border border-primary/20 shrink-0"
                        style={{ background: 'rgba(124,58,237,0.08)', boxShadow: '0 0 12px rgba(124,58,237,0.15)' }}
                      >
                        <span className="text-lg font-black font-headline text-primary-dim">{cls.class_name[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base md:text-lg leading-tight text-on-surface">{cls.class_name}</h4>
                        <p className="text-on-surface-variant/60 text-xs md:text-sm font-label mt-0.5">{timeLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-tight text-on-surface-variant/60 font-bold font-label mb-1.5">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${badge}`}>{cls.rate}% Presence</span>
                      </div>
                      <div className="w-24 md:w-32">
                        <p className="text-[10px] uppercase tracking-tight text-on-surface-variant/60 font-bold font-label mb-1.5">Fill Rate</p>
                        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className={`h-full rounded-full ${bar}`} style={{ width: barWidth }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Module attendance */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-headline text-on-surface">Module Attendance</h3>
                <Link href="/courses" className="text-primary-dim text-sm font-label font-medium hover:underline">View All Modules</Link>
              </div>
              <div className="space-y-4">
                {activeModules.map(mod => {
                  const { badge, bar, barWidth } = presenceBadgeClass(mod.rate)
                  return (
                    <div key={mod.module_id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6 rounded-xl border border-white/[0.07]"
                      style={glassRow}>
                      <div className="flex items-center gap-5">
                        <div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border border-secondary/20 shrink-0"
                          style={{ background: 'rgba(6,182,212,0.06)' }}
                        >
                          <span className="text-xs font-black font-headline text-secondary-dim">{mod.code}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-base leading-tight text-on-surface">{mod.module_name}</h4>
                          <p className="text-on-surface-variant/60 text-xs font-label mt-0.5">{mod.sessions} sessions · {mod.topics} chapters</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 md:gap-8 shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-tight text-on-surface-variant/60 font-bold font-label mb-1.5">Status</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${badge}`}>{mod.rate}% Presence</span>
                        </div>
                        <div className="w-24 md:w-32">
                          <p className="text-[10px] uppercase tracking-tight text-on-surface-variant/60 font-bold font-label mb-1.5">Fill Rate</p>
                          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className={`h-full rounded-full ${bar}`} style={{ width: barWidth }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Teacher performance */}
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-bold font-headline text-on-surface">Teacher Activity</h3>
              <div className="space-y-3">
                {overview.teacher_activity.map(t => {
                  const barGradient = 'from-primary to-primary-dim'
                  return (
                    <div key={t.teacher_id} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06]" style={glassCard}>
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                        <Image src={avatarFor(t.teacher_id)} alt={t.teacher_name} width={36} height={36} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{t.teacher_name}</p>
                        <div className="mt-1.5 h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${t.percentage_of_total}%` }} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold font-label text-on-surface">{t.sessions} sessions</p>
                        <p className="text-[10px] text-on-surface-variant/60 font-label">{t.percentage_of_total}% of total</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right panel (1/3 width) */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline text-on-surface">Critical Alerts</h3>
              <span className="bg-tertiary text-white text-[10px] font-black px-2 py-0.5 rounded font-label uppercase">{overview.critical_alerts.length} Active</span>
            </div>
            <div
              className="rounded-2xl p-5 md:p-6 border-l-4 border-tertiary space-y-5 border border-tertiary/20"
              style={{ background: 'rgba(244,63,94,0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
            >
              <p className="text-sm text-on-surface-variant/60 font-label">Multiple consecutive absences detected. Recommended intervention required.</p>
              <div className="space-y-4">
                {overview.critical_alerts.map(a => (
                  <Link key={`${a.student_id}`} href={`/students/${a.student_id}`} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-tertiary/20 shrink-0">
                      <Image src={avatarFor(a.student_id)} alt={a.student_name} width={44} height={44} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-on-surface truncate">{a.student_name}</p>
                        <span className="text-tertiary-dim font-black text-xs font-headline shrink-0">{a.consecutive_absences} missed</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant/60 font-label">{a.class_name}</p>
                    </div>
                  </Link>
                ))}
                {overview.critical_alerts.length === 0 && (
                  <p className="text-sm text-on-surface-variant/60 font-label">No alerts right now.</p>
                )}
              </div>
              <button
                className="w-full py-3 rounded-xl font-label font-bold text-[11px] uppercase tracking-widest border border-white/[0.08] text-on-surface-variant/60 hover:text-on-surface transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                Launch Outreach Program
              </button>
            </div>

            {/* Institution Health donut */}
            <div
              className="rounded-2xl p-5 md:p-6 relative overflow-hidden border border-white/[0.07]"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
            >
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-[60px]" style={{ background: 'rgba(6,182,212,0.12)' }} />
              <h4 className="text-sm font-bold font-headline mb-6 text-on-surface">Institution Health</h4>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <ProgressNebula value={overview.overall_rate} size={128} strokeWidth={8} />
                  <div className="absolute text-center">
                    <span className="text-2xl font-black font-headline block text-on-surface">{overview.overall_rate}%</span>
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-label">Retention</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] text-on-surface-variant/60 font-label mt-4">Total attendance across all classes is within target range.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile FAB */}
      <Link
        href="/attend"
        className="fixed bottom-24 right-6 z-40 md:hidden w-14 h-14 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}
      >
        <Plus size={28} className="text-white" weight="bold" />
      </Link>
    </PrincipalShell>
  )
}
