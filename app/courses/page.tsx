import PrincipalShell from '@/components/layout/PrincipalShell'
import { getCourses, getCourseAverageAttendance } from '@/lib/mock-data'
import CourseDirectoryClient from './CourseDirectoryClient'

export default function CoursesPage() {
  const courses = getCourses()
  const rates = Object.fromEntries(courses.map(c => [c.id, getCourseAverageAttendance(c.id)]))
  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-8 pb-4">
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface tracking-tight mb-6">Course Directory</h1>
        <CourseDirectoryClient courses={courses} rates={rates} />
      </div>
    </PrincipalShell>
  )
}
