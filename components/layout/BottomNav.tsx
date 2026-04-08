'use client'
import Link from 'next/link'
import { House, CalendarCheck, BookOpen, Users, ChalkboardTeacher } from '@phosphor-icons/react'

const tabs = [
  { href: '/dashboard',  label: 'Dashboard',  Icon: House },
  { href: '/attendance', label: 'Attendance', Icon: CalendarCheck },
  { href: '/courses',    label: 'Modules',    Icon: BookOpen },
  { href: '/students',   label: 'Students',   Icon: Users },
  { href: '/teachers',   label: 'Teachers',   Icon: ChalkboardTeacher },
]

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="border-t border-white/5 px-2 py-2" style={{ background: 'rgba(6,14,32,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
      <div className="flex justify-around">
        {tabs.map(({ href, label, Icon }) => {
          const active = currentPath === href || (href !== '/dashboard' && currentPath.startsWith(href))
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-4 py-1">
              <Icon size={22} weight={active ? 'fill' : 'regular'}
                className={active ? 'text-primary' : 'text-on-surface-variant'} />
              <span className={`text-[10px] font-label ${active ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
