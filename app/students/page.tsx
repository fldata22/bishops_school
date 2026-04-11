import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import StudentClassGroups from './StudentClassGroups'

export default async function StudentsPage() {
  const [students, classes, teachers] = await Promise.all([
    api.listStudents(),
    api.listClasses(),
    api.listTeachers(),
  ])

  // Build teacher → classes → students hierarchy
  const teacherGroups = teachers
    .map(teacher => {
      const teacherClasses = classes
        .filter(cls => cls.teacher_id === teacher.id)
        .map(cls => ({
          classId: cls.id,
          className: cls.name,
          students: students.filter(s => s.class_id === cls.id),
        }))
        .filter(g => g.students.length > 0)

      return {
        teacherId: teacher.id,
        teacherName: teacher.name,
        classes: teacherClasses,
        totalStudents: teacherClasses.reduce((sum, g) => sum + g.students.length, 0),
      }
    })
    .filter(tg => tg.classes.length > 0)

  // Classes with no teacher assigned
  const unassignedClasses = classes
    .filter(cls => cls.teacher_id === null)
    .map(cls => ({
      classId: cls.id,
      className: cls.name,
      students: students.filter(s => s.class_id === cls.id),
    }))
    .filter(g => g.students.length > 0)

  if (unassignedClasses.length > 0) {
    teacherGroups.push({
      teacherId: -1,
      teacherName: 'No teacher assigned',
      classes: unassignedClasses,
      totalStudents: unassignedClasses.reduce((sum, g) => sum + g.students.length, 0),
    })
  }

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Students</h1>
          <p className="text-on-surface-variant/60 font-label text-sm">
            {students.length} students across {teacherGroups.length} teacher{teacherGroups.length !== 1 ? 's' : ''}
          </p>
        </div>

        <StudentClassGroups teacherGroups={teacherGroups} />
      </div>
    </PrincipalShell>
  )
}
