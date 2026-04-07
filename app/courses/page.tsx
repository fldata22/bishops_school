import PrincipalShell from '@/components/layout/PrincipalShell'
import { getCourses, getCourseAverageAttendance, getTeachers } from '@/lib/mock-data'
import CourseDirectoryClient from './CourseDirectoryClient'

export default function CoursesPage() {
  const courses = getCourses()
  const teachers = getTeachers()
  const rates = Object.fromEntries(courses.map(c => [c.id, getCourseAverageAttendance(c.id)]))
  const teacherMap = Object.fromEntries(teachers.map(t => [t.id, t.name]))
  const avgAttendance = courses.length > 0
    ? Math.round(Object.values(rates).reduce((a, b) => a + b, 0) / courses.length)
    : 0

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        {/* Desktop header + KPI pills */}
        <div className="hidden md:flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-headline tracking-tighter mb-2">Class Directory</h1>
            <p className="text-on-surface-variant max-w-xl font-label">Curated list of active seminars, research labs, and academic lectures for the current semester.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <span className="text-on-surface-variant text-xs block mb-1 font-label">Total Classes</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-headline">{courses.length}</span>
                <span className="text-secondary text-xs font-semibold font-label">active</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <span className="text-on-surface-variant text-xs block mb-1 font-label">Avg. Attendance</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-headline">{avgAttendance}%</span>
                <span className="text-tertiary text-xs font-semibold font-label">Elite Level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold font-headline tracking-tight">Course Directory</h1>
        </div>

        <CourseDirectoryClient courses={courses} rates={rates} teachers={teacherMap} />
      </div>
    </PrincipalShell>
  )
}
