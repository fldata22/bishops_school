'use client'
import { useState } from 'react'
import type { ApiBook, ChapterAttendanceRow, ModuleBookBreakdown } from '@/lib/api-types'
import { CheckCircle, Circle } from '@phosphor-icons/react'

interface Props {
  books: ApiBook[]
  bookBreakdown: ModuleBookBreakdown[]
  chapterAttendance: ChapterAttendanceRow[]
}

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default function BookProgressList({ books, bookBreakdown, chapterAttendance }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Index breakdowns by book id for quick lookup
  const breakdownByBook = new Map(bookBreakdown.map(b => [b.book_id, b]))

  // Index taught chapters: book_id -> Set<chapter_index>
  const taughtChapters = new Map<number, Set<number>>()
  for (const row of chapterAttendance) {
    if (row.rate === null) continue
    if (!taughtChapters.has(row.book_id)) {
      taughtChapters.set(row.book_id, new Set())
    }
    taughtChapters.get(row.book_id)!.add(row.chapter_index)
  }

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.04]" style={glassCard}>
      {books.length === 0 && (
        <p className="px-6 py-4 text-sm text-on-surface-variant/60 font-label">No books in this module yet.</p>
      )}
      {books.map((book, i) => {
        const breakdown = breakdownByBook.get(book.id)
        const rate = breakdown?.rate ?? 0
        const chaptersTaught = breakdown?.chapters_taught ?? 0
        const totalChapters = book.chapters.length
        const taught = chaptersTaught > 0
        const expanded = expandedId === book.id
        const taughtSet = taughtChapters.get(book.id) ?? new Set<number>()

        const barGradient = !taught
          ? undefined
          : rate >= 80
            ? 'from-secondary to-secondary-dim'
            : rate >= 65
              ? 'from-primary to-primary-dim'
              : 'from-tertiary to-tertiary-dim'
        const rateColor = !taught
          ? 'text-on-surface-variant/60'
          : rate >= 80
            ? 'text-secondary-dim'
            : rate >= 65
              ? 'text-primary-dim'
              : 'text-tertiary-dim'

        return (
          <div key={book.id}>
            <button
              onClick={() => setExpandedId(expanded ? null : book.id)}
              className="w-full px-4 md:px-6 py-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span
                className="w-6 h-6 rounded-full text-[10px] font-bold font-label text-on-surface-variant/60 flex items-center justify-center shrink-0 border border-white/[0.08]"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-on-surface-variant/40 text-xs shrink-0">{expanded ? '▾' : '▸'}</span>
                  <p className="text-sm font-label font-medium text-on-surface truncate">{book.name}</p>
                </div>
                <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5 ml-5">
                  {chaptersTaught}/{totalChapters} chapters taught
                </p>
                <div className="mt-1.5 ml-5 h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {barGradient && (
                    <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${rate}%` }} />
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 w-20">
                {taught ? (
                  <span className={`text-sm font-black font-headline ${rateColor}`}>{rate}%</span>
                ) : (
                  <span className="text-[10px] font-label text-on-surface-variant/50 uppercase tracking-wider">Not started</span>
                )}
              </div>
            </button>

            {expanded && (
              <ul className="px-4 md:px-6 pb-4 pt-1 ml-9 space-y-1">
                {book.chapters.map((chapter, idx) => {
                  const isTaught = taughtSet.has(idx)
                  return (
                    <li key={idx} className="flex items-center gap-2 py-1">
                      {isTaught ? (
                        <CheckCircle size={14} weight="fill" className="text-secondary-dim shrink-0" />
                      ) : (
                        <Circle size={14} className="text-on-surface-variant/30 shrink-0" />
                      )}
                      <span className={`text-xs font-label ${isTaught ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                        {chapter}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
