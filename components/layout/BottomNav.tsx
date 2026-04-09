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
    <nav
      className="border-t border-white/[0.06] px-2 py-2"
      style={{
        background: 'rgba(7,7,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex justify-around">
        {tabs.map(({ href, label, Icon }) => {
          const active = currentPath === href || (href !== '/dashboard' && currentPath.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 min-h-[44px] px-3 py-1 justify-center"
            >
              <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200
                ${active ? 'bg-primary/20' : ''}`}>
                <Icon
                  size={20}
                  weight={active ? 'fill' : 'regular'}
                  className={active ? 'text-primary-dim' : 'text-on-surface-variant/45'}
                />
                <span className={`text-[10px] font-label ${active ? 'text-primary-dim font-semibold' : 'text-on-surface-variant/45'}`}>
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
