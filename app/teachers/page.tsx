import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import TeacherCard from '@/components/teachers/TeacherCard'

export default async function TeachersPage() {
  const [teachers, classes, overview] = await Promise.all([
    api.listTeachers(),
    api.listClasses(),
    api.getAttendanceOverview(),
  ])

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Teachers</h1>
            <p className="text-on-surface-variant/60 font-label text-sm">{teachers.length} teachers across all classes</p>
          </div>
        </div>

        {/* Teacher cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachers.map(teacher => {
            const teacherClasses = classes
              .filter(c => c.teacher_id === teacher.id)
              .map(c => ({ id: c.id, name: c.name }))
            const activity = overview.teacher_activity.find(a => a.teacher_id === teacher.id)
            const sessionsCount = activity?.sessions ?? 0
            const attendanceRate = 0 // will come from /teachers/{id}/stats when opened
            const sessionPct = activity?.percentage_of_total ?? 0

            return (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                classes={teacherClasses}
                sessions={sessionsCount}
                sessionsThisMonth={sessionsCount}
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
