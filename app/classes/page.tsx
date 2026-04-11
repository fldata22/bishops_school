import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import { GraduationCap, CaretRight } from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default async function ClassesPage() {
  const [classes, teachers, students] = await Promise.all([
    api.listClasses(),
    api.listTeachers(),
    api.listStudents(),
  ])

  const teacherName = (id: number | null) => teachers.find(t => t.id === id)?.name ?? '—'
  const studentCount = (classId: number) => students.filter(s => s.class_id === classId).length

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">Curriculum</p>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-on-surface">Classes</h1>
          <p className="text-on-surface-variant/60 font-label text-sm mt-1">{classes.length} classes · {students.length} students</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
            <Link
              key={cls.id}
              href={`/classes/${cls.id}`}
              className="rounded-2xl p-6 border border-white/[0.07] hover:border-white/[0.12] transition-colors group flex flex-col gap-4"
              style={glassCard}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                  style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}>
                  <GraduationCap size={22} className="text-primary-dim" />
                </div>
                <CaretRight size={16} className="text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-headline text-on-surface leading-tight">{cls.name}</h3>
                <p className="text-xs text-on-surface-variant/60 font-label mt-1">{teacherName(cls.teacher_id)}</p>
              </div>
              <span className="text-[10px] font-label text-on-surface-variant/60 px-2 py-0.5 rounded-full border border-white/[0.07] self-start"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                {studentCount(cls.id)} students
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PrincipalShell>
  )
}
