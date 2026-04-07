'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/lib/types'
import { MagnifyingGlass, User, CalendarBlank, Clock, Funnel, Timer } from '@phosphor-icons/react'
import CourseCard from '@/components/ui/CourseCard'

type Filter = 'all' | 'morning' | 'afternoon'

interface Props {
  courses: Course[]
  rates: Record<string, number>
  teachers?: Record<string, string>
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

export default function CourseDirectoryClient({ courses, rates, teachers }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(query.toLowerCase())
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'morning' ? c.schedule.time < '12:00' :
      c.schedule.time >= '12:00'
    return matchesSearch && matchesFilter
  })

  return (
    <>
      {/* Desktop filter bar */}
      <div className="hidden md:flex flex-wrap items-center gap-4 p-2 bg-surface-container-low rounded-2xl border border-outline-variant/10 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search classes or instructors…"
            className="w-full bg-surface-container-highest border border-outline-variant/40 rounded-xl pl-9 pr-4 py-2.5 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-all duration-200"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
          <Funnel size={14} />
          Subject
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
          <Timer size={14} />
          Time
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-label font-semibold text-background bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity duration-200">
          Apply Filters
        </button>
      </div>

      {/* Mobile search + filter pills */}
      <div className="md:hidden mb-6 space-y-4">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search classes or instructors…"
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-4 py-3 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-all duration-200"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'morning', 'afternoon'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-label font-semibold capitalize transition-colors duration-200
                ${filter === f
                  ? 'bg-primary/10 border border-primary/20 text-primary'
                  : 'bg-surface-container-high text-on-surface-variant'}`}
            >
              {f === 'all' ? 'All Classes' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile curation header */}
      <div className="md:hidden flex justify-between items-end mb-6">
        <div>
          <p className="text-secondary text-xs font-bold tracking-widest uppercase font-label mb-1">Curation</p>
          <h2 className="font-headline text-2xl font-bold tracking-tight">Active Directories</h2>
        </div>
        <span className="text-on-surface-variant text-xs font-medium bg-surface-container-high px-3 py-1 rounded-full font-label">
          {filtered.length} Results
        </span>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => (
          <CourseCard
            key={c.id}
            course={c}
            avgRate={rates[c.id] ?? 0}
            teacherName={teachers?.[c.teacherId]}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm font-label text-on-surface-variant col-span-3">No courses match your search.</p>
        )}
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-4">
        {filtered.map(c => {
          const rate = rates[c.id] ?? 0
          const teacherName = teachers?.[c.teacherId]

          const badgeBg =
            rate >= 80 ? 'bg-secondary/10' :
            rate >= 65 ? 'bg-primary/10' :
            'bg-error/10'
          const badgeBorder =
            rate >= 80 ? 'border-secondary/20' :
            rate >= 65 ? 'border-primary/20' :
            'border-error/20'
          const badgeColor =
            rate >= 80 ? 'text-secondary' :
            rate >= 65 ? 'text-primary' :
            'text-error'
          const badgeSubColor =
            rate >= 80 ? 'text-secondary/70' :
            rate >= 65 ? 'text-primary/70' :
            'text-error/70'

          return (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="block rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden active:scale-[0.98] transition-transform duration-200"
              style={{
                background: 'rgba(25, 37, 64, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '0.5px solid rgba(109, 117, 140, 0.1)',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-headline text-lg font-bold text-on-surface leading-tight mb-1">{c.name}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                    <User size={14} />
                    <span>{teacherName ?? ''}</span>
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-xl text-center border ${badgeBg} ${badgeBorder}`}>
                  <span className={`font-bold text-lg leading-none ${badgeColor}`}>{rate}%</span>
                  <p className={`text-[10px] uppercase tracking-tighter mt-1 ${badgeSubColor}`}>Attendance</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-label">
                  <CalendarBlank size={12} />
                  {c.schedule.days.slice(0, 2).join(', ')}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-label">
                  <Clock size={12} />
                  {formatTime(c.schedule.time)}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm font-label text-on-surface-variant">No courses match your search.</p>
        )}
      </div>
    </>
  )
}
