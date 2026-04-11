'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  SquaresFour, CalendarCheck, BookOpen, Users, ChalkboardTeacher, GearSix,
  GraduationCap, List, X,
} from '@phosphor-icons/react'
import Sidebar from './Sidebar'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',  Icon: SquaresFour },
  { href: '/attendance', label: 'Attendance', Icon: CalendarCheck },
  { href: '/classes',    label: 'Classes',    Icon: GraduationCap },
  { href: '/courses',    label: 'Modules',    Icon: BookOpen },
  { href: '/students',   label: 'Students',   Icon: Users },
  { href: '/teachers',   label: 'Teachers',   Icon: ChalkboardTeacher },
  { href: '/admin',      label: 'Admin',      Icon: GearSix },
]

export default function PrincipalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const currentLabel = navItems.find(
    n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
  )?.label ?? 'School Attendance'

  return (
    <div className="min-h-[100dvh]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPath={pathname} />
      </div>

      {/* Top header — desktop */}
      <header
        className="hidden md:flex fixed top-0 right-0 left-0 md:left-64 h-16 z-50 items-center px-6 md:px-8 border-b border-white/[0.06]"
        style={{
          background: 'rgba(7,7,15,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <p className="text-sm font-label font-semibold text-on-surface-variant/60 uppercase tracking-wider">{currentLabel}</p>
      </header>

      {/* Top header — mobile, with hamburger */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center px-4 gap-3 border-b border-white/[0.06]"
        style={{
          background: 'rgba(7,7,15,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 -ml-2 rounded-lg flex items-center justify-center text-on-surface-variant/70 hover:text-on-surface hover:bg-white/[0.04] active:scale-95 transition-all"
        >
          <List size={22} />
        </button>
        <div className="flex flex-col leading-tight">
          <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">Bishops School</p>
          <p className="text-sm font-headline font-bold text-on-surface">{currentLabel}</p>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] z-50 flex flex-col py-6 px-4 border-r border-white/[0.08] transition-transform duration-300 ease-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'rgba(7,7,15,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between px-4 pt-2 pb-6">
          <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">Bishops School</p>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 -mr-2 rounded-lg flex items-center justify-center text-on-surface-variant/70 hover:text-on-surface hover:bg-white/[0.04] active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 border
                  ${active
                    ? 'bg-primary/[0.18] border-primary/[0.28] text-primary-dim'
                    : 'border-transparent text-on-surface-variant/45 hover:text-on-surface/70 hover:bg-surface/[0.04]'
                  }`}
              >
                <Icon size={20} weight={active ? 'fill' : 'regular'} />
                <span className="font-label font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User profile in drawer */}
        <div
          className="mt-auto border border-white/[0.08] rounded-xl px-3 py-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 shrink-0 bg-gradient-to-br from-primary to-secondary">
            <Image
              src="https://i.pravatar.cc/80?u=principal-julian"
              alt="Principal"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-on-surface">Dr. Julian Vance</p>
            <p className="text-[10px] text-on-surface-variant/45 uppercase tracking-widest font-label">Admin</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 pt-14 md:pt-16 pb-12 min-h-[100dvh]">
        {children}
      </main>
    </div>
  )
}
