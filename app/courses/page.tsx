import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import CourseDirectoryClient from './CourseDirectoryClient'

export default async function CoursesPage() {
  const modules = await api.listModules()

  // Fetch progress in parallel for each module to build the rate lookup.
  const progressResults = await Promise.all(
    modules.map(m =>
      api.getModuleProgress(m.id).then(p => [m.id, p.completion_rate] as const)
    )
  )
  const rates: Record<number, number> = Object.fromEntries(progressResults)

  const avgCompletion = modules.length > 0
    ? Math.round(Object.values(rates).reduce((a, b) => a + b, 0) / modules.length)
    : 0

  return (
    <PrincipalShell>
      <div className="px-6 md:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        {/* Desktop header + KPI pills */}
        <div className="hidden md:flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-headline tracking-tighter mb-2">Module Directory</h1>
            <p className="text-on-surface-variant/60 max-w-xl font-label">All active modules in the School Attendance curriculum for the current semester.</p>
          </div>
          <div className="flex gap-4">
            <div
              className="px-6 py-4 rounded-xl border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
              <span className="text-on-surface-variant/60 text-xs block mb-1 font-label">Total Modules</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-headline">{modules.length}</span>
                <span className="text-secondary-dim text-xs font-semibold font-label">active</span>
              </div>
            </div>
            <div
              className="px-6 py-4 rounded-xl border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
              <span className="text-on-surface-variant/60 text-xs block mb-1 font-label">Avg. Completion</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-headline">{avgCompletion}%</span>
                <span className="text-tertiary-dim text-xs font-semibold font-label">chapters taught</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold font-headline tracking-tight">Module Directory</h1>
        </div>

        <CourseDirectoryClient courses={modules} rates={rates} />
      </div>
    </PrincipalShell>
  )
}
