import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getInstitutionHealth, getCriticalAlerts, getCourses, getCourseAverageAttendance,
  getPresentTodayCount, getAbsentTodayCount, getStudents
} from '@/lib/mock-data'
import CriticalAlertCard from '@/components/ui/CriticalAlertCard'
import CourseCard from '@/components/ui/CourseCard'
import ProgressNebula from '@/components/ui/ProgressNebula'

export default function DashboardPage() {
  const health = getInstitutionHealth()
  const alerts = getCriticalAlerts()
  const courses = getCourses().slice(0, 4)
  const presentToday = getPresentTodayCount()
  const absentToday = getAbsentTodayCount()
  const totalStudents = getStudents().length

  return (
    <PrincipalShell>
      {/* Mobile layout */}
      <div className="md:hidden px-4 pt-8 pb-4">
        {/* Hero */}
        <div className="mb-6">
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">Current Semester Performance</p>
          <div className="flex items-end gap-3">
            <h1 className="text-6xl font-headline font-bold text-on-surface tracking-tight">{health}%</h1>
          </div>
          <p className="text-xs font-label text-secondary mt-1">Institution-wide attendance</p>
        </div>

        {/* Critical Alerts */}
        {alerts.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-headline font-bold text-on-surface">Critical Alerts</h2>
              <span className="text-[10px] font-label text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">{alerts.length} Active</span>
            </div>
            <div className="flex flex-col gap-2">
              {alerts.map(a => <CriticalAlertCard key={`${a.studentId}-${a.courseId}`} alert={a} />)}
            </div>
          </section>
        )}

        {/* Recent Courses */}
        <section>
          <h2 className="text-sm font-headline font-bold text-on-surface mb-3">Recent Course Attendance</h2>
          <div className="flex flex-col gap-2">
            {courses.map(c => (
              <CourseCard key={c.id} course={c} avgRate={getCourseAverageAttendance(c.id)} />
            ))}
          </div>
        </section>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Attendance Overview</h1>
          <p className="text-sm font-label text-on-surface-variant mt-1">Academic Quarter: Q3 · Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Students', value: totalStudents },
            { label: 'Present Today',  value: presentToday, accent: 'mint' as const },
            { label: 'Absent Today',   value: absentToday,  accent: 'rose' as const },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-high rounded-xl p-5">
              <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-4xl font-headline font-bold tracking-tight ${s.accent === 'mint' ? 'text-secondary' : s.accent === 'rose' ? 'text-tertiary' : 'text-on-surface'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6">
          {/* Course list */}
          <section>
            <h2 className="text-base font-headline font-bold text-on-surface mb-4">Recent Course Attendance</h2>
            <div className="flex flex-col gap-3">
              {getCourses().map(c => (
                <CourseCard key={c.id} course={c} avgRate={getCourseAverageAttendance(c.id)} />
              ))}
            </div>
          </section>

          {/* Right panel */}
          <div className="flex flex-col gap-6">
            {/* Critical Alerts */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-headline font-bold text-on-surface">Critical Alerts</h2>
                <span className="text-[10px] font-label text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">{alerts.length} Active</span>
              </div>
              <div className="flex flex-col gap-2">
                {alerts.length === 0
                  ? <p className="text-sm font-label text-on-surface-variant">No at-risk students.</p>
                  : alerts.map(a => <CriticalAlertCard key={`${a.studentId}-${a.courseId}`} alert={a} />)}
              </div>
            </section>

            {/* Institution Health donut */}
            <section className="bg-surface-container-high rounded-xl p-5 flex flex-col items-center gap-3">
              <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Institution Health</p>
              <div className="relative">
                <ProgressNebula value={health} size={96} strokeWidth={8} />
                <span className="absolute inset-0 flex items-center justify-center text-lg font-headline font-bold text-on-surface">{health}%</span>
              </div>
              <p className="text-xs font-label text-on-surface-variant text-center">Total attendance across all courses is within target range.</p>
            </section>
          </div>
        </div>
      </div>
    </PrincipalShell>
  )
}
