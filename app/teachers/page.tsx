import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getTeachers, getClassesForTeacher, getSessionsByTeacher,
  getTeacherAttendanceRate, getSessionsThisMonthByTeacher,
  getTotalSessionsCount
} from '@/lib/mock-data'
import TeacherCard from '@/components/teachers/TeacherCard'

export default function TeachersPage() {
  const teachers = getTeachers()
  const totalSessions = getTotalSessionsCount()

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Teachers</h1>
            <p className="text-on-surface-variant font-label text-sm">{teachers.length} teachers across all classes</p>
          </div>
        </div>

        {/* Teacher cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachers.map(teacher => {
            const classes = getClassesForTeacher(teacher.id)
            const sessions = getSessionsByTeacher(teacher.id)
            const sessionsThisMonth = getSessionsThisMonthByTeacher(teacher.id)
            const attendanceRate = getTeacherAttendanceRate(teacher.id)
            const sessionPct = totalSessions > 0 ? Math.round((sessions.length / totalSessions) * 100) : 0

            return (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                classes={classes}
                sessions={sessions.length}
                sessionsThisMonth={sessionsThisMonth}
                attendanceRate={attendanceRate}
                sessionPct={sessionPct}
              />
            )
          })}
        </div>

      </div>
    </PrincipalShell>
  )
}
