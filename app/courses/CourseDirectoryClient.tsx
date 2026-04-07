'use client'
import { useState } from 'react'
import type { Course } from '@/lib/types'
import { MagnifyingGlass } from '@phosphor-icons/react'
import CourseCard from '@/components/ui/CourseCard'

type Filter = 'all' | 'morning' | 'afternoon'

interface Props { courses: Course[]; rates: Record<string, number> }

export default function CourseDirectoryClient({ courses, rates }: Props) {
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
      <div className="relative mb-4">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search classes or instructors…"
          className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-4 py-3 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-all duration-200" />
      </div>
      <div className="flex gap-2 mb-5">
        {(['all','morning','afternoon'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-label font-semibold capitalize transition-colors duration-200
              ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
            {f === 'all' ? 'All Classes' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => <CourseCard key={c.id} course={c} avgRate={rates[c.id] ?? 0} />)}
        {filtered.length === 0 && <p className="text-sm font-label text-on-surface-variant col-span-3">No courses match your search.</p>}
      </div>
    </>
  )
}
