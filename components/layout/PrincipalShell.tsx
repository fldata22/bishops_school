'use client'
import Image from 'next/image'
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

      {/* Top header — glass */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 z-50 flex justify-between items-center px-6 md:px-8 border-b border-white/5"
        style={{ background: 'rgba(6,14,32,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        {/* Left slot */}
        <div className="flex items-center gap-3 md:flex-1 md:max-w-md">
          {/* Mobile: avatar + title */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/30 shrink-0 ring-2 ring-primary/10">
              <Image
                src="https://i.pravatar.cc/80?u=principal-julian"
                alt="Principal"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold font-headline text-primary">Attendance</span>
          </div>
          {/* Desktop: search input */}
          <div className="relative flex-1 hidden md:block">
            <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
            <input
              placeholder="Search students or modules..."
              className="w-full rounded-full pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all font-label border border-white/5 focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="md:ml-64 pt-16 pb-20 md:pb-12 min-h-[100dvh]">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
