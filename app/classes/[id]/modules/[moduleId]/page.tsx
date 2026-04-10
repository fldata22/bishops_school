import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import { CaretLeft, CheckCircle, Circle, BookOpen } from '@phosphor-icons/react/dist/ssr'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default async function ClassModuleDetailPage({
  params,
}: {
  params: { id: string; moduleId: string }
}) {
  const classId = Number(params.id)
  const moduleId = Number(params.moduleId)
  if (!Number.isFinite(classId) || !Number.isFinite(moduleId)) notFound()

  let schoolClass, mod
  try {
    ;[schoolClass, mod] = await Promise.all([
      api.getClass(classId),
      api.getModule(moduleId),
    ])
  } catch {
    notFound()
  }

  const sessions = await api.listSessions({ class_id: classId, module_id: moduleId })

  // Build a set of taught (book_id, chapter_index) pairs
  const taughtKeys = new Set(sessions.map(s => `${s.book_id}:${s.chapter_index}`))

  const totalChapters = mod.books.reduce((sum, b) => sum + b.chapters.length, 0)
  const taughtCount = taughtKeys.size
  const completionRate = totalChapters > 0 ? Math.round((taughtCount / totalChapters) * 100) : 0

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-12 max-w-5xl mx-auto">
        <Link
          href={`/classes/${classId}`}
          className="inline-flex items-center gap-1.5 text-xs font-label text-on-surface-variant/60 hover:text-primary-dim transition-colors mb-6"
        >
          <CaretLeft size={14} />
          {schoolClass.name}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">{schoolClass.name} · Module</p>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-on-surface">{mod.name}</h1>
          <p className="text-sm text-on-surface-variant/60 font-label mt-1">{mod.code} · {mod.books.length} books · {totalChapters} chapters</p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Completion</p>
            <p className="text-3xl font-black font-headline text-primary-dim">{completionRate}%</p>
            <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">{taughtCount}/{totalChapters} chapters</p>
          </div>
          <div className="rounded-xl p-4 border border-white/[0.07]" style={glassCard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-label mb-1">Sessions Held</p>
            <p className="text-3xl font-black font-headline text-secondary-dim">{sessions.length}</p>
          </div>
        </div>

        {/* Books with chapter breakdown */}
        <h2 className="text-lg font-bold font-headline text-on-surface mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-dim" />
          Books & Chapters
        </h2>
        <div className="space-y-4">
          {mod.books.length === 0 && (
            <p className="text-sm text-on-surface-variant/60 font-label">No books in this module.</p>
          )}
          {mod.books.map(book => {
            const taughtInBook = book.chapters.filter((_, idx) =>
              taughtKeys.has(`${book.id}:${idx}`)
            ).length
            const bookRate = book.chapters.length > 0
              ? Math.round((taughtInBook / book.chapters.length) * 100)
              : 0
            return (
              <div key={book.id} className="rounded-xl border border-white/[0.07] overflow-hidden" style={glassCard}>
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm font-headline text-on-surface truncate">{book.name}</p>
                    <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">{taughtInBook}/{book.chapters.length} chapters taught</p>
                  </div>
                  <span className="text-sm font-black font-headline text-primary-dim shrink-0">{bookRate}%</span>
                </div>
                <ul className="divide-y divide-white/[0.04]">
                  {book.chapters.map((chap, idx) => {
                    const taught = taughtKeys.has(`${book.id}:${idx}`)
                    return (
                      <li key={idx} className="px-4 py-2 flex items-center gap-3">
                        {taught
                          ? <CheckCircle size={16} weight="fill" className="text-secondary-dim shrink-0" />
                          : <Circle size={16} className="text-on-surface-variant/30 shrink-0" />
                        }
                        <span className={`text-xs font-label flex-1 truncate ${taught ? 'text-on-surface' : 'text-on-surface-variant/60'}`}>{chap}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </PrincipalShell>
  )
}
