'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Users, ChalkboardTeacher, BookOpen, GraduationCap, CalendarCheck,
  SquaresFour, List, X,
} from '@phosphor-icons/react'

const adminLinks = [
  { href: '/admin/classes',    label: 'Classes',    Icon: GraduationCap },
  { href: '/admin/teachers',   label: 'Teachers',   Icon: ChalkboardTeacher },
  { href: '/admin/students',   label: 'Students',   Icon: Users },
  { href: '/admin/modules',    label: 'Modules',    Icon: BookOpen },
  { href: '/admin/attendance', label: 'Attendance', Icon: CalendarCheck },
]

const mainLinks = [
  { href: '/dashboard',  label: 'Dashboard',  Icon: SquaresFour },
  { href: '/attendance', label: 'Attendance', Icon: CalendarCheck },
  { href: '/classes',    label: 'Classes',    Icon: GraduationCap },
  { href: '/courses',    label: 'Modules',    Icon: BookOpen },
  { href: '/students',   label: 'Students',   Icon: Users },
  { href: '/teachers',   label: 'Teachers',   Icon: ChalkboardTeacher },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
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

  const currentLabel = adminLinks.find(l => pathname === l.href || pathname.startsWith(l.href))?.label ?? 'Admin'

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

        {/* Back to app link at bottom of desktop sidebar */}
        <Link
          href="/dashboard"
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-sm border border-white/[0.08] text-on-surface-variant/60 hover:text-on-surface hover:bg-white/[0.04] transition-colors"
        >
          <SquaresFour size={18} />
          <span className="font-label font-medium">Back to App</span>
        </Link>
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
        <p className="text-sm font-label font-semibold text-on-surface-variant/60 uppercase tracking-wider">Admin · {currentLabel}</p>
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
          <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">Admin</p>
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
        className={`md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] z-50 flex flex-col py-6 px-4 border-r border-white/[0.08] overflow-y-auto transition-transform duration-300 ease-out
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'rgba(7,7,15,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between px-4 pt-2 pb-4">
          <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">Bishops School</p>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 -mr-2 rounded-lg flex items-center justify-center text-on-surface-variant/70 hover:text-on-surface hover:bg-white/[0.04] active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <p className="px-4 pt-2 pb-2 text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">Admin</p>
        <nav className="space-y-1 mb-4">
          {adminLinks.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href)
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

        <p className="px-4 pt-2 pb-2 text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">App</p>
        <nav className="space-y-1">
          {mainLinks.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm border border-transparent text-on-surface-variant/45 hover:text-on-surface/70 hover:bg-surface/[0.04] transition-all"
            >
              <Icon size={20} />
              <span className="font-label font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 pt-14 md:pt-16 pb-12 min-h-[100dvh]">
        {children}
      </main>
    </div>
  )
}
