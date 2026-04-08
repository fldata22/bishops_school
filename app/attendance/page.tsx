import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import Link from 'next/link'
import {
  getInstitutionHealth, getCriticalAlerts,
  getClasses, getClassAttendanceRate, getStudentsByClass,
  getSessionsThisMonth,
  getPresentTodayCount, getAbsentTodayCount, getStudents, getAttendanceRate,
  getTeachers, getSessionsByTeacher, getTeacherAttendanceRate, getTotalSessionsCount,
  getStudentAvatarUrl,
  getModules, getModuleAttendanceRate, getSessionsByModule,
} from '@/lib/mock-data'
import ProgressNebula from '@/components/ui/ProgressNebula'
import { TrendUp, WarningCircle, EnvelopeSimple, Plus } from '@phosphor-icons/react/dist/ssr'

// Color thresholds for presence badge
function presenceBadgeClass(rate: number) {
  if (rate >= 80) return { badge: 'bg-secondary-container/30 text-secondary ring-secondary/20', bar: 'bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.3)]', barWidth: `${rate}%` }
  if (rate >= 65) return { badge: 'bg-primary-container/30 text-primary ring-primary/20', bar: 'bg-primary shadow-[0_0_8px_rgba(163,166,255,0.3)]', barWidth: `${rate}%` }
  return { badge: 'bg-error-container/30 text-error ring-error/20', bar: 'bg-error shadow-[0_0_8px_rgba(215,51,87,0.3)]', barWidth: `${rate}%` }
}

export default function DashboardPage() {
  const health = getInstitutionHealth()
  const alerts = getCriticalAlerts()
  const classes = getClasses()
  const presentToday = getPresentTodayCount()
  const absentToday = getAbsentTodayCount()
  const totalStudents = getStudents().length
  const totalSessions = getTotalSessionsCount()

  // Enrich alerts with absent/total counts for "X/Y Missed" display
  const enrichedAlerts = alerts.map(a => {
    const { present, total } = getAttendanceRate(a.studentId)
    return { ...a, absent: total - present, total }
  })

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Modules that have at least one session
  const activeModules = getModules()
    .map(m => ({ module: m, rate: getModuleAttendanceRate(m.id), sessions: getSessionsByModule(m.id).length }))
    .filter(x => x.sessions > 0)

  const kpis = [
    { label: 'Total Students',  value: totalStudents, secondary: null,          glow: 'bg-primary/5',   bar: 'bg-primary',   barWidth: '100%' },
    { label: 'Present Today',   value: presentToday,  secondary: `${health}%`,  glow: 'bg-secondary/5', bar: 'bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.4)]', barWidth: `${health}%` },
    { label: 'Absent',          value: absentToday,   secondary: null,          glow: 'bg-error/5',     bar: 'bg-error',     barWidth: `${Math.round((absentToday / Math.max(totalStudents, 1)) * 100)}%` },
    { label: 'Teachers', value: getTeachers().length, secondary: null, glow: 'bg-tertiary/5', bar: 'bg-tertiary', barWidth: '100%' },
  ]

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto space-y-10">

        {/* Hero header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Attendance Overview</h2>
            <p className="text-on-surface-variant font-label text-sm">Academic Quarter: Q3 · Today is {today}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/attend"
              className="px-6 py-2.5 rounded-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-label font-bold text-sm shadow-xl shadow-primary/20 hover:scale-95 transition-transform">
              Take Attendance
            </Link>
          </div>
        </div>

        {/* Mobile hero card */}
        <section className="md:hidden relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-surface-container-high to-surface">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 blur-[64px] rounded-full" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-label text-on-surface-variant uppercase tracking-[0.2em] text-[10px] mb-2 font-semibold">Overall Attendance</span>
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-extrabold tracking-tighter text-primary font-headline">{health}</span>
              <span className="text-3xl font-bold text-primary-dim font-headline">%</span>
            </div>
            <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
              <TrendUp size={14} className="text-secondary" />
              <span className="text-secondary font-medium text-xs font-label">+2.4% from last month</span>
            </div>
          </div>
        </section>

        {/* KPI Grid — desktop only */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-surface-container-high rounded-xl p-5 md:p-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.glow} rounded-full -mr-16 -mt-16 blur-3xl`} />
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-4 font-label">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black font-headline">{kpi.value}</span>
                {kpi.secondary && <span className="text-on-surface-variant text-sm font-label">{kpi.secondary}</span>}
              </div>
              <div className="mt-5 w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${kpi.bar}`} style={{ width: kpi.barWidth }} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile critical alerts */}
        <section className="md:hidden space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-headline flex items-center gap-2">
              <WarningCircle size={20} className="text-error" weight="fill" />
              Critical Alerts
            </h2>
            <span className="text-xs font-medium text-error bg-error/10 px-2.5 py-1 rounded-md font-label">{alerts.length} Actions Needed</span>
          </div>
          <div className="space-y-3">
            {enrichedAlerts.map(a => (
              <Link key={`mob-${a.studentId}-${a.classId}`} href={`/students/${a.studentId}`}
                className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4 border-l-4 border-error hover:bg-surface-container-high transition-colors">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-error/10 shrink-0">
                  <Image src={getStudentAvatarUrl(a.studentId)} alt={a.studentName} width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold text-sm text-on-surface">{a.studentName}</h4>
                  <p className="text-xs text-on-surface-variant font-label">{a.consecutiveAbsences} consecutive absences · {a.className}</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-error shrink-0">
                  <EnvelopeSimple size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mobile class cards */}
        <section className="md:hidden space-y-4">
          <h2 className="text-lg font-bold font-headline">Class Attendance</h2>
          <div className="space-y-4">
            {classes.map(cls => {
              const avgRate = getClassAttendanceRate(cls.id)
              const students = getStudentsByClass(cls.id)
              const presentCount = Math.round((avgRate / 100) * students.length)
              const { bar } = presenceBadgeClass(avgRate)
              const statusLabel = avgRate >= 80 ? 'High Stability' : avgRate >= 65 ? 'Attention Required' : 'Critical'
              const statusColor = avgRate >= 80 ? 'text-secondary' : avgRate >= 65 ? 'text-on-surface' : 'text-error'
              const sessionsMonth = getSessionsThisMonth(cls.id)
              return (
                <div key={`mob-${cls.id}`}
                  className="block p-5 bg-surface-container-highest rounded-3xl border border-outline-variant/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-label text-primary-dim">{cls.id.toUpperCase()}</span>
                      <h3 className="text-base font-bold text-on-surface font-headline">{cls.name} Class</h3>
                      <p className="text-xs text-on-surface-variant font-label">{sessionsMonth} sessions this month</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xl font-bold font-headline ${statusColor}`}>{avgRate}%</span>
                      <span className="text-[10px] text-on-surface-variant font-label">{statusLabel}</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2 relative z-10">
                    <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${avgRate}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-on-surface-variant font-label">
                      <span>{presentCount}/{students.length} Students Present</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Mobile module attendance */}
        <section className="md:hidden space-y-4">
          <h2 className="text-lg font-bold font-headline">Module Attendance</h2>
          <div className="space-y-4">
            {activeModules.map(({ module, rate, sessions }) => {
              const { bar } = presenceBadgeClass(rate)
              const statusColor = rate >= 80 ? 'text-secondary' : rate >= 65 ? 'text-on-surface' : 'text-error'
              return (
                <div key={`mob-mod-${module.id}`}
                  className="block p-5 bg-surface-container-highest rounded-3xl border border-outline-variant/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-label text-primary-dim">{module.code}</span>
                      <h3 className="text-base font-bold text-on-surface font-headline">{module.name}</h3>
                      <p className="text-xs text-on-surface-variant font-label">{sessions} sessions · {module.topics.length} topics</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xl font-bold font-headline ${statusColor}`}>{rate}%</span>
                      <span className="text-[10px] text-on-surface-variant font-label">Attendance</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 relative z-10">
                    <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${rate}%` }} />
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
              <h3 className="text-xl font-bold font-headline">Class Attendance</h3>
              <Link href="/courses" className="text-primary text-sm font-label font-medium hover:underline">View Modules</Link>
            </div>
            <div className="space-y-4">
              {classes.map(cls => {
                const avgRate = getClassAttendanceRate(cls.id)
                const { badge, bar, barWidth } = presenceBadgeClass(avgRate)
                const students = getStudentsByClass(cls.id)
                const sessionsMonth = getSessionsThisMonth(cls.id)
                const timeLabel = `${students.length} students · ${sessionsMonth} sessions this month`
                return (
                  <div key={cls.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6 rounded-xl transition-transform duration-200 group"
                    style={{ background: 'rgba(25, 37, 64, 0.4)', backdropFilter: 'blur(12px)', border: '0.5px solid rgba(109, 117, 140, 0.1)' }}>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/10 shrink-0">
                        <span className="text-lg font-black font-headline text-primary">{cls.name[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base md:text-lg leading-tight text-on-surface">{cls.name} Class</h4>
                        <p className="text-on-surface-variant text-xs md:text-sm font-label mt-0.5">{timeLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-tight text-on-surface-variant font-bold font-label mb-1.5">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${badge}`}>{avgRate}% Presence</span>
                      </div>
                      <div className="w-24 md:w-32">
                        <p className="text-[10px] uppercase tracking-tight text-on-surface-variant font-bold font-label mb-1.5">Fill Rate</p>
                        <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
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
                <h3 className="text-xl font-bold font-headline">Module Attendance</h3>
                <Link href="/courses" className="text-primary text-sm font-label font-medium hover:underline">View All Modules</Link>
              </div>
              <div className="space-y-4">
                {activeModules.map(({ module, rate, sessions }) => {
                  const { badge, bar, barWidth } = presenceBadgeClass(rate)
                  return (
                    <div key={module.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6 rounded-xl transition-transform duration-200"
                      style={{ background: 'rgba(25, 37, 64, 0.4)', backdropFilter: 'blur(12px)', border: '0.5px solid rgba(109, 117, 140, 0.1)' }}>
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/10 shrink-0">
                          <span className="text-sm font-black font-headline text-primary">{module.code}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-base leading-tight text-on-surface">{module.name}</h4>
                          <p className="text-on-surface-variant text-xs font-label mt-0.5">{sessions} sessions · {module.topics.length} topics</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 md:gap-8 shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-tight text-on-surface-variant font-bold font-label mb-1.5">Status</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${badge}`}>{rate}% Presence</span>
                        </div>
                        <div className="w-24 md:w-32">
                          <p className="text-[10px] uppercase tracking-tight text-on-surface-variant font-bold font-label mb-1.5">Fill Rate</p>
                          <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
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
              <h3 className="text-lg font-bold font-headline">Teacher Activity</h3>
              <div className="space-y-3">
                {getTeachers().map(teacher => {
                  const teacherSessions = getSessionsByTeacher(teacher.id)
                  const rate = getTeacherAttendanceRate(teacher.id)
                  const pct = totalSessions > 0 ? Math.round((teacherSessions.length / totalSessions) * 100) : 0
                  const barColor = rate >= 80 ? 'bg-secondary' : rate >= 65 ? 'bg-primary' : 'bg-error'
                  return (
                    <div key={teacher.id} className="flex items-center gap-4 p-4 rounded-xl"
                      style={{ background: 'rgba(25,37,64,0.4)', border: '0.5px solid rgba(109,117,140,0.15)' }}>
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/20 shrink-0">
                        <Image src={`https://i.pravatar.cc/80?u=${teacher.id}`} alt={teacher.name} width={36} height={36} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{teacher.name}</p>
                        <div className="mt-1.5 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold font-label text-on-surface">{teacherSessions.length} sessions</p>
                        <p className="text-[10px] text-on-surface-variant font-label">{pct}% of total</p>
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
              <h3 className="text-xl font-bold font-headline">Critical Alerts</h3>
              <span className="bg-error text-on-error text-[10px] font-black px-2 py-0.5 rounded font-label uppercase">{alerts.length} Active</span>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-5 md:p-6 border-l-4 border-error space-y-5">
              <p className="text-sm text-on-surface-variant font-label">Multiple consecutive absences detected. Recommended intervention required.</p>
              <div className="space-y-4">
                {enrichedAlerts.map(a => (
                  <Link key={`${a.studentId}-${a.classId}`} href={`/students/${a.studentId}`} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-error/10 shrink-0">
                      <Image src={getStudentAvatarUrl(a.studentId)} alt={a.studentName} width={44} height={44} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-on-surface truncate">{a.studentName}</p>
                        <span className="text-error font-black text-xs font-headline shrink-0">{a.absent}/{a.total} Missed</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-label">{a.className}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="w-full py-3 rounded-xl bg-surface-container text-on-surface-variant font-label font-bold text-[11px] uppercase tracking-widest border border-outline-variant/10 hover:text-on-surface transition-colors">
                Launch Outreach Program
              </button>
            </div>

            {/* Institution Health donut */}
            <div className="bg-surface-container-high rounded-2xl p-5 md:p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #141f38, #0f1930)' }}>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-secondary/10 rounded-full blur-[60px]" />
              <h4 className="text-sm font-bold font-headline mb-6">Institution Health</h4>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <ProgressNebula value={health} size={128} strokeWidth={8} />
                  <div className="absolute text-center">
                    <span className="text-2xl font-black font-headline block">{health}%</span>
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-label">Retention</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] text-on-surface-variant font-label mt-4">Total attendance across all classes is within target range.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile FAB */}
      <Link href="/attend"
        className="fixed bottom-24 right-6 z-40 md:hidden w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform">
        <Plus size={28} className="text-on-primary" weight="bold" />
      </Link>
    </PrincipalShell>
  )
}
