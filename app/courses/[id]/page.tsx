import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getCourseById, getStudentsForCourse, getCourseAverageAttendance,
  getSessionsForCourse, getAttendanceForSession, getSessionsThisMonth,
  getAttendanceRate, getTeacherById
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
  const course = getCourseById(params.id)
  if (!course) notFound()

  const students = getStudentsForCourse(params.id)
  const avgRate = getCourseAverageAttendance(params.id)
  const sessionsThisMonth = getSessionsThisMonth(params.id)

  const sessions = getSessionsForCourse(params.id).sort((a, b) => b.date.localeCompare(a.date))
  const latestSession = sessions[0]
  const latestAttendance = latestSession ? getAttendanceForSession(latestSession.id) : []
  const presentCount = latestAttendance.filter(a => a.status === 'present').length
  const absentCount = latestAttendance.filter(a => a.status === 'absent').length

  const teacher = getTeacherById(course.teacherId)

  // Derive a subject from course name (first word before any dash or colon, or first two words)
  const subject = course.name.split(/[-:]/)[0].trim()

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* DESKTOP ONLY */}
        <div className="hidden md:block">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs font-label text-on-surface-variant uppercase tracking-widest mb-6">
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <CaretRight size={10} />
            <span className="text-on-surface-variant">{subject}</span>
            <CaretRight size={10} />
            <span className="text-on-surface">{course.id.toUpperCase()}</span>
          </nav>

          {/* Title + action buttons */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-primary">{course.name}</h1>
              <p className="text-on-surface-variant font-label max-w-xl leading-relaxed">
                {course.schedule.days.join(', ')} · {course.schedule.room}
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
                <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">In Attendance</span>
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
                    <th className="px-8 py-6">Attendance Status</th>
                    <th className="px-8 py-6">Overall Rate</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {students.map(student => {
                    const latestStatus = latestAttendance.find(a => a.studentId === student.id)?.status ?? 'absent'
                    const { rate } = getAttendanceRate(student.id, params.id)
                    const initials = student.name.split(' ').map(n => n[0]).join('')
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
                            <div className="w-10 h-10 rounded-full border border-primary/20 bg-surface-container-highest flex items-center justify-center text-sm font-headline font-bold text-primary shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface">{student.name}</div>
                              <div className="text-xs text-on-surface-variant">{student.name.toLowerCase().replace(' ', '.')}@scholar.edu</div>
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

          {/* Bottom section: Lecture Notes + Avg Attendance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 space-y-4">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <NotePencil size={20} className="text-primary" />
                Lecture Notes
              </h3>
              <p className="text-sm text-on-surface-variant font-label leading-relaxed">
                Session focus for {course.name}. {sessionsThisMonth} sessions held this month. Students are encouraged to review course materials before each session.
              </p>
              <button className="text-primary text-xs font-semibold font-label hover:underline">Add more notes →</button>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 flex flex-col justify-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <TrendUp size={24} className="text-secondary" />
                </div>
                <div>
                  <div className="font-bold font-label">{avgRate}% Average Attendance</div>
                  <div className="text-xs text-on-surface-variant font-label">Consistent with semester trends for {course.id.toUpperCase()}</div>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(105,246,184,0.4)]"
                  style={{ width: `${avgRate}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE ONLY */}
        <div className="md:hidden">

          {/* Mobile: Current session hero */}
          <section className="space-y-1 mb-6">
            <p className="text-primary font-label text-sm font-semibold tracking-wider uppercase">Current Session</p>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface">{course.name}</h2>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <User size={16} />
              <span className="text-sm font-label font-medium">Instructor: {teacher?.name ?? 'Unknown'}</span>
            </div>
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
                const initials = student.name.split(' ').map(n => n[0]).join('')
                const isPresent = latestStatus === 'present'
                return (
                  <Link
                    key={`mob-${student.id}`}
                    href={`/students/${student.id}`}
                    className="bg-surface-container-highest rounded-xl p-4 flex items-center justify-between hover:bg-surface-bright transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-headline font-bold border-2 ${isPresent ? 'border-secondary/20 text-secondary' : 'border-error/20 text-error'} bg-surface-container-high`}>
                        {initials}
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
