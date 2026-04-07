import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import StatusBadge from '@/components/ui/StatusBadge'
import {
  getCourseById, getStudentsForCourse, getCourseAverageAttendance,
  getSessionsForCourse, getAttendanceForSession, getSessionsThisMonth,
  getAttendanceRate
} from '@/lib/mock-data'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = getCourseById(params.id)
  if (!course) notFound()

  const students = getStudentsForCourse(params.id)
  const avgRate = getCourseAverageAttendance(params.id)
  const sessionsThisMonth = getSessionsThisMonth(params.id)

  // Get latest session for live present/absent count
  const sessions = getSessionsForCourse(params.id).sort((a, b) => b.date.localeCompare(a.date))
  const latestSession = sessions[0]
  const latestAttendance = latestSession ? getAttendanceForSession(latestSession.id) : []
  const presentCount = latestAttendance.filter(a => a.status === 'present').length
  const absentCount = latestAttendance.filter(a => a.status === 'absent').length

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-8">
        {/* Breadcrumb — desktop only */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-label text-on-surface-variant mb-4">
          <Link href="/courses" className="hover:text-on-surface transition-colors">Courses</Link>
          <CaretRight size={12} />
          <span className="text-on-surface">{course.name}</span>
        </nav>

        <h1 className="text-2xl md:text-4xl font-headline font-bold text-on-surface tracking-tight mb-1">{course.name}</h1>
        <p className="text-sm font-label text-on-surface-variant mb-6">
          {course.schedule.days.join(', ')} · {course.schedule.time} · {course.schedule.room}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-2xl font-headline font-bold text-on-surface">{students.length}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Enrolled</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-2xl font-headline font-bold text-secondary">{presentCount}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Present</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-2xl font-headline font-bold text-tertiary">{absentCount}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Absent</p>
          </div>
        </div>

        {/* Avg rate + sessions this month */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-xl">
            <span className="text-sm font-headline font-bold text-secondary">{avgRate}%</span>
            <span className="text-xs font-label text-on-surface-variant">avg attendance</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-xl">
            <span className="text-sm font-headline font-bold text-on-surface">{sessionsThisMonth}</span>
            <span className="text-xs font-label text-on-surface-variant">sessions this month</span>
          </div>
        </div>

        {/* Student list */}
        <h2 className="text-base font-headline font-bold text-on-surface mb-3">Students</h2>
        <div className="flex flex-col gap-2">
          {students.map(student => {
            const { rate } = getAttendanceRate(student.id, params.id)
            const latestStatus = latestAttendance.find(a => a.studentId === student.id)?.status ?? 'absent'
            return (
              <Link key={student.id} href={`/students/${student.id}`}
                className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl hover:bg-surface-bright transition-colors duration-200">
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-headline font-bold text-primary shrink-0">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-label font-semibold text-on-surface truncate">{student.name}</p>
                  <p className="text-xs font-label text-on-surface-variant">{rate}% overall attendance</p>
                </div>
                <StatusBadge status={latestStatus} />
              </Link>
            )
          })}
        </div>
      </div>
    </PrincipalShell>
  )
}
