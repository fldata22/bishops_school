import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import { api } from '@/lib/api'
import {
  CaretRight,
  UserCheck,
  Users,
  BookOpen,
  NotePencil,
} from '@phosphor-icons/react/dist/ssr'
import BookProgressList from './BookProgressList'

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const moduleId = Number(params.id)
  if (!Number.isFinite(moduleId)) notFound()

  let moduleData, progress
  try {
    ;[moduleData, progress] = await Promise.all([
      api.getModule(moduleId),
      api.getModuleProgress(moduleId),
    ])
  } catch {
    notFound()
  }

  const totalChapters = progress.module.total_chapters
  const chaptersTaught = progress.chapters_taught
  const completionRate = progress.completion_rate
  const attendanceRate = progress.attendance_rate

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10 max-w-7xl mx-auto">

        {/* DESKTOP + MOBILE shared header */}
        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-6">
          <Link href="/courses" className="hover:text-primary-dim transition-colors">Modules</Link>
          <CaretRight size={10} />
          <span className="text-on-surface-variant/60">{moduleData.code}</span>
          <CaretRight size={10} />
          <span className="text-on-surface">{moduleData.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <p className="md:hidden text-primary-dim font-label text-sm font-semibold tracking-wider uppercase">Module</p>
            <h1 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tighter text-primary-dim">{moduleData.name}</h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/attend"
              className="px-8 py-3 rounded-full font-bold font-label flex items-center gap-2 text-sm text-white hover:opacity-90 hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}
            >
              <UserCheck size={18} weight="fill" />
              Mark Attendance
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="p-5 md:p-6 rounded-xl border border-white/[0.07] flex flex-col gap-3" style={glassCard}>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}>
              <BookOpen size={20} className="text-primary-dim" />
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-headline font-bold text-on-surface">{moduleData.books.length}</span>
              <p className="text-on-surface-variant/60 font-label text-xs mt-1">Books</p>
            </div>
          </div>
          <div className="p-5 md:p-6 rounded-xl border border-white/[0.07] flex flex-col gap-3" style={glassCard}>
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(6,182,212,0.2)' }}>
              <NotePencil size={20} className="text-secondary-dim" />
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-headline font-bold text-secondary-dim">{chaptersTaught}</span>
              <p className="text-on-surface-variant/60 font-label text-xs mt-1">of {totalChapters} chapters taught</p>
            </div>
          </div>
          <div className="p-5 md:p-6 rounded-xl border border-white/[0.07] flex flex-col gap-3" style={glassCard}>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}>
              <Users size={20} className="text-primary-dim" />
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-headline font-bold text-primary-dim">{completionRate}%</span>
              <p className="text-on-surface-variant/60 font-label text-xs mt-1">Completion</p>
            </div>
          </div>
          <div className="p-5 md:p-6 rounded-xl border border-white/[0.07] flex flex-col gap-3" style={glassCard}>
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(6,182,212,0.2)' }}>
              <UserCheck size={20} className="text-secondary-dim" />
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-headline font-bold text-secondary-dim">{attendanceRate}%</span>
              <p className="text-on-surface-variant/60 font-label text-xs mt-1">Attendance rate</p>
            </div>
          </div>
        </div>

        {/* Book Progress */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg flex items-center gap-2">
              <NotePencil size={20} className="text-primary-dim" />
              Book Progress
            </h3>
            <span
              className="text-xs font-label text-on-surface-variant/60 px-3 py-1 rounded-full border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {progress.book_breakdown.filter(b => b.chapters_taught > 0).length}/{progress.book_breakdown.length} started
            </span>
          </div>
          <BookProgressList
            books={moduleData.books}
            bookBreakdown={progress.book_breakdown}
            chapterAttendance={progress.chapter_attendance}
          />
        </div>

        {/* Class Breakdown */}
        {progress.class_breakdown.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-lg">Class Breakdown</h3>
            <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.04]" style={glassCard}>
              {progress.class_breakdown.map(cls => {
                const rateColor = cls.rate >= 80 ? 'text-secondary-dim' : cls.rate >= 65 ? 'text-primary-dim' : 'text-tertiary-dim'
                const barGradient = cls.rate >= 80 ? 'from-secondary to-secondary-dim' : cls.rate >= 65 ? 'from-primary to-primary-dim' : 'from-tertiary to-tertiary-dim'
                return (
                  <div key={cls.class_id} className="px-4 md:px-6 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-label font-medium text-on-surface truncate">{cls.class_name}</p>
                      <p className="text-[10px] text-on-surface-variant/60 font-label mt-0.5">{cls.sessions} session{cls.sessions !== 1 ? 's' : ''}</p>
                      <div className="mt-1.5 h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className={`h-full rounded-full bg-gradient-to-r ${barGradient}`} style={{ width: `${cls.rate}%` }} />
                      </div>
                    </div>
                    <span className={`text-sm font-black font-headline ${rateColor} shrink-0`}>{cls.rate}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </PrincipalShell>
  )
}
