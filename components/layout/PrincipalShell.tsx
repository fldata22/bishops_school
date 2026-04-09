'use client'
import { usePathname } from 'next/navigation'
import { MagnifyingGlass } from '@phosphor-icons/react'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

export default function PrincipalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-[100dvh]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPath={pathname} />
      </div>

      {/* Top header — glass, desktop only */}
      <header
        className="hidden md:flex fixed top-0 right-0 left-0 md:left-64 h-16 z-50 justify-between items-center px-6 md:px-8 border-b border-white/[0.06]"
        style={{
          background: 'rgba(7,7,15,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
          <input
            placeholder="Search students or modules..."
            className="w-full rounded-full pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all font-label border border-white/[0.08] focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="md:ml-64 md:pt-16 pb-20 md:pb-12 min-h-[100dvh]">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
