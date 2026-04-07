import { notFound } from 'next/navigation'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getStudentById, getCoursesForStudent, getAttendanceRate,
  getRecentAttendanceHistory
} from '@/lib/mock-data'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressNebula from '@/components/ui/ProgressNebula'

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = getStudentById(params.id)
  if (!student) notFound()

  const courses = getCoursesForStudent(params.id)
  const history = getRecentAttendanceHistory(params.id)
  const initials = student.name.split(' ').map(n => n[0]).join('')

  const totalPresent = courses.reduce((acc, c) => acc + getAttendanceRate(params.id, c.id).present, 0)
  const totalSessions = courses.reduce((acc, c) => acc + getAttendanceRate(params.id, c.id).total, 0)
  const totalAbsent = totalSessions - totalPresent
  const overallRate = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0

  const isAwardEligible = overallRate >= 90

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-xl md:text-2xl font-headline font-bold text-primary shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Student Profile</p>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface tracking-tight">{student.name}</h1>
            <p className="text-sm font-label text-on-surface-variant mt-0.5">{overallRate}% overall attendance</p>
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-3xl font-headline font-bold text-secondary">{totalPresent}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Present</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-3xl font-headline font-bold text-tertiary">{totalAbsent}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Absent</p>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* Class-wise breakdown */}
          <section className="mb-8 md:mb-0">
            <h2 className="text-base font-headline font-bold text-on-surface mb-4">Class-wise Breakdown</h2>
            <div className="flex flex-col gap-3">
              {courses.map(course => {
                const { rate } = getAttendanceRate(params.id, course.id)
                return (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
                    <ProgressNebula value={rate} size={40} strokeWidth={4} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-label font-semibold text-on-surface truncate">{course.name}</p>
                      <div className="mt-1.5 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full transition-all duration-700"
                          style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-headline font-bold text-on-surface shrink-0">{rate}%</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recent history */}
          <section>
            <h2 className="text-base font-headline font-bold text-on-surface mb-4">Recent History</h2>
            <div className="flex flex-col gap-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-label font-semibold text-on-surface truncate">{h.courseName}</p>
                    <p className="text-xs font-label text-on-surface-variant">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <StatusBadge status={h.status} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Award banner */}
        {isAwardEligible && (
          <div className="mt-8 p-4 md:p-6 bg-surface-container-high rounded-xl border border-secondary/20">
            <p className="text-sm font-headline font-bold text-secondary mb-1">Excellence Award Eligible</p>
            <p className="text-xs font-label text-on-surface-variant">{student.name} is maintaining {overallRate}% attendance — on track for the Scholar Excellence recognition.</p>
          </div>
        )}
      </div>
    </PrincipalShell>
  )
}
