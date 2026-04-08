import Image from 'next/image'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getInstitutionHealth, getTeachers, getTeacherAttendanceRate, getStudents,
} from '@/lib/mock-data'

function rateColor(rate: number) {
  if (rate >= 80) return { text: 'text-secondary', bar: 'bg-secondary' }
  if (rate >= 65) return { text: 'text-primary', bar: 'bg-primary' }
  return { text: 'text-error', bar: 'bg-error' }
}

export default function DashboardPage() {
  const overallRate = getInstitutionHealth()
  const teachers = getTeachers()
  const totalStudents = getStudents().length

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-on-surface">Dashboard</h1>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overall attendance */}
          <div className="col-span-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-label mb-3">Overall Attendance</p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black font-headline text-on-surface">{overallRate}</span>
              <span className="text-2xl font-bold text-on-surface-variant font-headline">%</span>
            </div>
            <p className="text-xs text-on-surface-variant font-label mt-2">Across all modules and classes</p>
          </div>

          {/* Total students */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/10 blur-3xl rounded-full" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label mb-3">Students</p>
            <span className="text-5xl font-black font-headline text-secondary">{totalStudents}</span>
            <p className="text-xs text-on-surface-variant font-label mt-2">Enrolled</p>
          </div>

          {/* Total teachers */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-tertiary/10 blur-3xl rounded-full" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label mb-3">Instructors</p>
            <span className="text-5xl font-black font-headline text-tertiary">{teachers.length}</span>
            <p className="text-xs text-on-surface-variant font-label mt-2">Teaching</p>
          </div>
        </div>

        {/* Teacher performance */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-headline">Instructor Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teachers.map(teacher => {
              const rate = getTeacherAttendanceRate(teacher.id)
              const { text, bar } = rateColor(rate)
              const label = rate >= 80 ? 'Excellent' : rate >= 65 ? 'Good' : 'Needs attention'
              return (
                <div key={teacher.id} className="p-4 rounded-xl"
                  style={{ background: 'rgba(25,37,64,0.4)', border: '0.5px solid rgba(109,117,140,0.12)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/20 shrink-0">
                      <Image src={`https://i.pravatar.cc/80?u=${teacher.id}`} alt={teacher.name} width={36} height={36} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{teacher.name}</p>
                      <p className={`text-[10px] font-label ${text}`}>{label}</p>
                    </div>
                    <span className={`text-xl font-black font-headline ${text}`}>{rate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${bar}`} style={{ width: `${rate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </PrincipalShell>
  )
}
