'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Users, ChalkboardTeacher, BookOpen, GraduationCap } from '@phosphor-icons/react'
import BottomNav from './BottomNav'

const adminLinks = [
  { href: '/admin/classes',  label: 'Classes',  Icon: Users },
  { href: '/admin/teachers', label: 'Teachers', Icon: ChalkboardTeacher },
  { href: '/admin/students', label: 'Students', Icon: GraduationCap },
  { href: '/admin/modules',  label: 'Modules',  Icon: BookOpen },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-[100dvh]">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 h-full w-64 flex-col py-8 px-4 gap-y-1 z-40 border-r border-white/[0.06]"
        style={{
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="px-4 pt-2 pb-4">
          <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">Admin</p>
        </div>
        <nav className="flex-1 space-y-0.5">
          {adminLinks.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 border
                  ${active
                    ? 'bg-primary/[0.18] border-primary/[0.28] text-primary-dim'
                    : 'border-transparent text-on-surface-variant/45 hover:text-on-surface/70 hover:bg-surface/[0.04]'
                  }`}
              >
                <Icon size={18} weight={active ? 'fill' : 'regular'} />
                <span className="font-label font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Top header — desktop */}
      <header
        className="hidden md:flex fixed top-0 right-0 left-64 h-16 z-50 items-center px-8 border-b border-white/[0.06]"
        style={{
          background: 'rgba(7,7,15,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <p className="text-sm font-label font-semibold text-on-surface-variant/60 uppercase tracking-wider">Admin</p>
      </header>

      {/* Main content */}
      <main className="md:ml-64 md:pt-16 pb-20 md:pb-12 min-h-[100dvh]">
        {children}
      </main>

      {/* Mobile bottom nav — reuse global nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
