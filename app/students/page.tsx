import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import StudentClassGroups from './StudentClassGroups'

export default async function StudentsPage() {
  const [students, classes, teachers] = await Promise.all([
    api.listStudents(),
    api.listClasses(),
    api.listTeachers(),
  ])

  const teacherName = (id: number | null) =>
    teachers.find(t => t.id === id)?.name ?? 'No teacher assigned'

  const groups = classes
    .map(cls => ({
      classId: cls.id,
      className: cls.name,
      teacherName: teacherName(cls.teacher_id),
      students: students.filter(s => s.class_id === cls.id),
    }))
    .filter(g => g.students.length > 0)

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Students</h1>
          <p className="text-on-surface-variant/60 font-label text-sm">{students.length} students across {groups.length} classes</p>
        </div>

        <StudentClassGroups groups={groups} />
      </div>
    </PrincipalShell>
  )
}
