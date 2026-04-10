import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'

function getStudentAvatarUrl(student: { id: number; image: string | null; gender: string | null }) {
  if (student.image) return student.image
  const gender = student.gender === 'female' ? 'girl' : 'boy'
  return `https://avatar.iran.liara.run/public/${gender}?username=${student.id}`
}

export default async function StudentsPage() {
  const [students, classes] = await Promise.all([
    api.listStudents(),
    api.listClasses(),
  ])

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface mb-2">Students</h1>
            <p className="text-on-surface-variant/60 font-label text-sm">{students.length} students across {classes.length} classes</p>
          </div>
        </div>

        {/* Classes */}
        <div className="space-y-12">
          {classes.map(cls => {
            const classStudents = students.filter(s => s.class_id === cls.id)
            if (classStudents.length === 0) return null
            const categoryLabel = cls.category === 'non_consecrated'
              ? 'Non-Consecrated'
              : cls.category === 'newly_consecrated'
                ? 'Newly Consecrated'
                : null

            return (
              <section key={cls.id}>
                {/* Class header */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                    style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}>
                    <span className="text-sm font-black text-primary-dim font-headline">{cls.name[0]}</span>
                  </div>
                  <h2 className="text-xl font-bold font-headline">{cls.name}</h2>
                  <span
                    className="text-xs font-label text-on-surface-variant/60 px-2.5 py-1 rounded-full border border-white/[0.07]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    {classStudents.length} students
                  </span>
                  {categoryLabel && (
                    <span
                      className="text-xs font-label text-primary-dim px-2.5 py-1 rounded-full border border-primary/20"
                      style={{ background: 'rgba(124,58,237,0.08)' }}
                    >
                      {categoryLabel}
                    </span>
                  )}
                </div>

                {/* Student grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classStudents.map(student => (
                    <Link
                      key={student.id}
                      href={`/students/${student.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 group"
                      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                        <Image
                          src={getStudentAvatarUrl(student)}
                          alt={student.name}
                          width={48}
                          height={48}
                          unoptimized={!!student.image}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface text-sm truncate group-hover:text-primary-dim transition-colors">{student.name}</p>
                        <p className="text-xs text-on-surface-variant/60 font-label truncate">{student.country ?? '—'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

      </div>
    </PrincipalShell>
  )
}
