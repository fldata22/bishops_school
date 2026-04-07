import PrincipalShell from '@/components/layout/PrincipalShell'
import { ChartBar } from '@phosphor-icons/react/dist/ssr'

export default function ReportsPage() {
  return (
    <PrincipalShell>
      <div className="min-h-[60dvh] flex flex-col items-center justify-center px-4 text-center">
        <ChartBar size={48} className="text-on-surface-variant mb-4" />
        <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">Reports</h1>
        <p className="text-sm font-label text-on-surface-variant max-w-xs">Detailed reporting and export features are coming in the next release.</p>
      </div>
    </PrincipalShell>
  )
}
