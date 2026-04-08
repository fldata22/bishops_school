'use client'
import Link from 'next/link'
import Image from 'next/image'
import {
  SquaresFour, CalendarCheck, BookOpen, Users, GraduationCap, ChalkboardTeacher
} from '@phosphor-icons/react'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',  Icon: SquaresFour },
  { href: '/attendance', label: 'Attendance', Icon: CalendarCheck },
  { href: '/courses',    label: 'Modules',    Icon: BookOpen },
  { href: '/students',   label: 'Students',   Icon: Users },
  { href: '/teachers',   label: 'Teachers',   Icon: ChalkboardTeacher },
]

export default function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="fixed left-0 h-full w-64 flex flex-col py-8 px-4 gap-y-6 z-40 border-r border-white/5"
      style={{ background: 'linear-gradient(160deg, rgba(14,22,46,0.98) 0%, rgba(6,14,32,0.99) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-lg shadow-primary/20">
          <GraduationCap size={22} weight="fill" className="text-on-primary" />
        </div>
        <div>
          <h1 className="text-lg font-black text-primary leading-none font-headline">School Attendance</h1>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, Icon }) => {
          const active = currentPath === href || (href !== '/dashboard' && currentPath.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200
                ${active
                  ? 'text-primary border-r-2 border-primary bg-primary/5 translate-x-px'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
              <Icon size={20} weight={active ? 'fill' : 'regular'} />
              <span className="font-label">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-outline-variant/10 pt-6">
        {/* User profile */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 shrink-0">
            <Image
              src="https://i.pravatar.cc/80?u=principal-julian"
              alt="Principal"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-on-surface">Dr. Julian Vance</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>

    </aside>
  )
}
