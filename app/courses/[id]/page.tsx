import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getModuleById, getStudentsForModule, getModuleAttendanceRate,
  getSessionsByModule, getAttendanceForSession, getTeachersForModule,
  getAttendanceRate, getStudentAvatarUrl, getModuleTopicStats
} from '@/lib/mock-data'
import {
  CaretRight,
  ArrowSquareOut,
  UserCheck,
  Users,
  CheckCircle,
  XCircle,
  DotsThree,
  NotePencil,
  TrendUp,
  User
} from '@phosphor-icons/react/dist/ssr'

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const moduleData = getModuleById(params.id)
  if (!moduleData) notFound()

  const students = getStudentsForModule(params.id)
  const avgRate = getModuleAttendanceRate(params.id)

  const sessions = getSessionsByModule(params.id).sort((a, b) => b.date.localeCompare(a.date))
  const latestSession = sessions[0]
  const latestAttendance = latestSession ? getAttendanceForSession(latestSession.id) : []
  const presentCount = latestAttendance.filter(a => a.status === 'present').length
  const absentCount = latestAttendance.filter(a => a.status === 'absent').length

  const now = new Date()
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const sessionsThisMonth = sessions.filter(s => s.date.startsWith(monthStr)).length

  const teacherAssignments = getTeachersForModule(params.id)
  const primaryTeacher = teacherAssignments[0]?.teacher
  const topicStats = getModuleTopicStats(params.id)
  const taughtCount = topicStats.filter(t => t.taught).length

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* DESKTOP ONLY */}
        <div className="hidden md:block">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs font-label text-on-surface-variant uppercase tracking-widest mb-6">
            <Link href="/courses" className="hover:text-primary transition-colors">Modules</Link>
            <CaretRight size={10} />
            <span className="text-on-surface-variant">{moduleData.code}</span>
            <CaretRight size={10} />
            <span className="text-on-surface">{moduleData.name}</span>
          </nav>

          {/* Title + action buttons */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-primary">{moduleData.name}</h1>
              <p className="text-on-surface-variant font-label max-w-xl leading-relaxed">
                {moduleData.topics.length} topics · Code: {moduleData.code}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 rounded-full border border-outline-variant/20 hover:bg-white/5 transition-all text-on-surface font-semibold font-label flex items-center gap-2 text-sm">
                <ArrowSquareOut size={18} />
                Export List
              </button>
              <Link
                href="/attend"
                className="px-8 py-3 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold font-label shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:scale-105 transition-all flex items-center gap-2 text-sm"
              >
                <UserCheck size={18} weight="fill" />
                Mark Attendance
              </Link>
            </div>
          </div>

          {/* Stats grid (3 cards) */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Total Students</span>
              </div>
              <div>
                <span className="text-4xl font-headline font-bold">{students.length}</span>
                <span className="text-on-surface-variant ml-2 font-label text-sm">Enrolled</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center">
                  <CheckCircle size={20} className="text-secondary" weight="fill" />
                </div>
                <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Last Session</span>
              </div>
              <div>
                <span className="text-4xl font-headline font-bold text-secondary">{presentCount}</span>
                <span className="text-on-surface-variant ml-2 font-label text-sm">Present</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-error/5 flex items-center justify-center">
                  <XCircle size={20} className="text-error" weight="fill" />
                </div>
                <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Missing</span>
              </div>
              <div>
                <span className="text-4xl font-headline font-bold text-error">{absentCount}</span>
                <span className="text-on-surface-variant ml-2 font-label text-sm">Absent</span>
              </div>
            </div>
          </div>

          {/* Student table */}
          <section className="bg-surface-container-high rounded-2xl overflow-hidden border border-outline-variant/5 shadow-2xl mb-10">
            <div className="bg-surface-container-low rounded-2xl overflow-hidden">
              <table className="w-full text-left font-label">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">
                    <th className="px-8 py-6">Student Name</th>
                    <th className="px-8 py-6">Last Session</th>
                    <th className="px-8 py-6">Overall Rate</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {students.map(student => {
                    const latestStatus = latestAttendance.find(a => a.studentId === student.id)?.status ?? 'absent'
                    const { rate } = getAttendanceRate(student.id)
                    const isPresent = latestStatus === 'present'
                    const statusColor = isPresent ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                    const dotColor = isPresent
                      ? 'bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.6)]'
                      : 'bg-error shadow-[0_0_8px_rgba(255,110,132,0.6)]'
                    const statusLabel = isPresent ? 'Present' : 'Absent'
                    return (
                      <tr key={student.id} className="group hover:bg-white/5 transition-all duration-200">
                        <td className="px-8 py-5">
                          <Link href={`/students/${student.id}`} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 shrink-0">
                              <Image
                                src={getStudentAvatarUrl(student.id)}
                                alt={student.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface">{student.name}</div>
                              <div className="text-xs text-on-surface-variant">{student.id.toUpperCase()}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm text-on-surface-variant">{rate}%</td>
                        <td className="px-8 py-5 text-right">
                          <button className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
                            <DotsThree size={20} weight="bold" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom section: Topic completion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <NotePencil size={20} className="text-primary" />
                Topic Progress
              </h3>
              <span className="text-xs font-label text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                {taughtCount}/{topicStats.length} taught
              </span>
            </div>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden divide-y divide-outline-variant/5">
              {topicStats.map((t, i) => {
                const barColor = !t.taught ? 'bg-outline-variant/30' : t.attendanceRate >= 80 ? 'bg-secondary' : t.attendanceRate >= 65 ? 'bg-primary' : 'bg-error'
                const rateColor = !t.taught ? 'text-on-surface-variant' : t.attendanceRate >= 80 ? 'text-secondary' : t.attendanceRate >= 65 ? 'text-primary' : 'text-error'
                return (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-surface-container-highest text-[10px] font-bold font-label text-on-surface-variant flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-label font-medium text-on-surface truncate">{t.topic}</p>
                      <div className="mt-1.5 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: t.taught ? `${t.attendanceRate}%` : '0%' }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0 w-20">
                      {t.taught ? (
                        <>
                          <span className={`text-sm font-black font-headline ${rateColor}`}>{t.attendanceRate}%</span>
                          <p className="text-[10px] text-on-surface-variant font-label">{t.sessions} session{t.sessions > 1 ? 's' : ''}</p>
                        </>
                      ) : (
                        <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Not started</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* MOBILE ONLY */}
        <div className="md:hidden">

          {/* Mobile: Current session hero */}
          <section className="space-y-1 mb-6">
            <p className="text-primary font-label text-sm font-semibold tracking-wider uppercase">Module</p>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface">{moduleData.name}</h2>
            {primaryTeacher && (
              <div className="flex items-center gap-2 text-on-surface-variant">
                <User size={16} />
                <span className="text-sm font-label font-medium">Instructor: {primaryTeacher.name}</span>
              </div>
            )}
          </section>

          {/* Mobile: Stats bento */}
          <section className="grid grid-cols-6 gap-3 mb-6">
            {/* Total enrolled - full width */}
            <div className="col-span-6 bg-surface-container-high rounded-xl p-5 border border-outline-variant/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={64} />
              </div>
              <p className="text-on-surface-variant text-sm font-label font-medium">Total Enrolled</p>
              <p className="text-4xl font-headline font-bold mt-1">{students.length}</p>
              <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full shadow-[0_0_8px_rgba(163,166,255,0.4)]" />
              </div>
            </div>
            {/* Present - half */}
            <div className="col-span-3 bg-surface-container-high rounded-xl p-5 border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <p className="text-on-surface-variant text-xs font-label font-medium uppercase tracking-tighter">Present</p>
              </div>
              <p className="text-3xl font-headline font-bold text-secondary">{String(presentCount).padStart(2, '0')}</p>
              <p className="text-[10px] text-on-surface-variant mt-1 font-label">
                {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}% Attendance
              </p>
            </div>
            {/* Absent - half */}
            <div className="col-span-3 bg-surface-container-high rounded-xl p-5 border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-error" />
                <p className="text-on-surface-variant text-xs font-label font-medium uppercase tracking-tighter">Absent</p>
              </div>
              <p className="text-3xl font-headline font-bold text-error">{String(absentCount).padStart(2, '0')}</p>
              <p className="text-[10px] text-on-surface-variant mt-1 font-label">Check logs</p>
            </div>
          </section>

          {/* Mobile: Topic progress */}
          <section className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold">Topic Progress</h3>
              <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-label font-medium text-primary">
                {taughtCount}/{topicStats.length} taught
              </span>
            </div>
            <div className="bg-surface-container-high rounded-xl overflow-hidden divide-y divide-outline-variant/5">
              {topicStats.map((t, i) => {
                const barColor = !t.taught ? 'bg-outline-variant/30' : t.attendanceRate >= 80 ? 'bg-secondary' : t.attendanceRate >= 65 ? 'bg-primary' : 'bg-error'
                const rateColor = !t.taught ? 'text-on-surface-variant' : t.attendanceRate >= 80 ? 'text-secondary' : t.attendanceRate >= 65 ? 'text-primary' : 'text-error'
                return (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-surface-container-highest text-[10px] font-bold font-label text-on-surface-variant flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-label font-medium text-on-surface truncate">{t.topic}</p>
                      <div className="mt-1 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: t.taught ? `${t.attendanceRate}%` : '0%' }} />
                      </div>
                    </div>
                    <div className="shrink-0 text-right w-16">
                      {t.taught ? (
                        <span className={`text-sm font-black font-headline ${rateColor}`}>{t.attendanceRate}%</span>
                      ) : (
                        <span className="text-[9px] font-label text-on-surface-variant uppercase tracking-wider">Pending</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Mobile: Students list */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold">Students List</h3>
              <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-label font-medium text-primary">
                {presentCount}/{students.length} Present
              </span>
            </div>
            <div className="space-y-3">
              {students.map(student => {
                const latestStatus = latestAttendance.find(a => a.studentId === student.id)?.status ?? 'absent'
                const isPresent = latestStatus === 'present'
                return (
                  <Link
                    key={`mob-${student.id}`}
                    href={`/students/${student.id}`}
                    className="bg-surface-container-highest rounded-xl p-4 flex items-center justify-between hover:bg-surface-bright transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${isPresent ? 'border-secondary/20' : 'border-error/20'} shrink-0`}>
                        <Image
                          src={getStudentAvatarUrl(student.id)}
                          alt={student.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-sm">{student.name}</p>
                        <p className="text-xs text-on-surface-variant font-label">ID: #{student.id.toUpperCase()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border font-label ${isPresent ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-error/10 text-error border-error/20'}`}>
                      {isPresent ? 'Present' : 'Absent'}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

        </div>

      </div>
    </PrincipalShell>
  )
}
