import type { ApiModule } from '@/lib/api-types'
import Link from 'next/link'
import { BookOpen, Users } from '@phosphor-icons/react/dist/ssr'

interface Props { course: ApiModule; avgRate: number; teacherName?: string }

export default function CourseCard({ course, avgRate, teacherName }: Props) {
  const rate = avgRate
  const iconColor =
    rate >= 80 ? 'bg-secondary/10 text-secondary-dim' :
    rate >= 65 ? 'bg-primary/10 text-primary-dim' :
                 'bg-tertiary/10 text-tertiary-dim'

  const progressGradient =
    rate >= 80 ? 'from-secondary to-secondary-dim' :
    rate >= 65 ? 'from-primary to-primary-dim' :
                 'from-tertiary to-tertiary-dim'

  const rateColor =
    rate >= 80 ? 'text-secondary-dim' :
    rate >= 65 ? 'text-primary-dim' :
                 'text-tertiary-dim'

  const glowColor =
    rate >= 80 ? '0 0 16px rgba(6,182,212,0.25)' :
    rate >= 65 ? '0 0 16px rgba(124,58,237,0.25)' :
                 '0 0 16px rgba(244,63,94,0.2)'

  return (
    <Link
      href={`/courses/${course.id}`}
      className="rounded-2xl p-6 flex flex-col gap-6 border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 group relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      {/* Shimmer top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Top row */}
      <div className="flex items-center justify-between">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconColor}`}
          style={{ boxShadow: glowColor }}
        >
          <BookOpen size={24} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 font-label">Attendance</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${progressGradient}`}
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className={`text-sm font-bold font-label ${rateColor}`}>{rate}%</span>
          </div>
        </div>
      </div>

      {/* Middle */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-bold font-headline text-on-surface leading-tight">{course.name}</h3>
        {teacherName && (
          <div className="flex items-center gap-2 text-on-surface-variant/60 text-sm font-label">
            <Users size={14} />
            <span>{teacherName}</span>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] pt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant/60 font-label">Module Code</span>
          <span className="text-sm font-medium text-on-surface font-label">{course.code}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant/60 font-label">Books</span>
          <span className="text-sm font-medium text-on-surface font-label">{course.books.length} books</span>
        </div>
      </div>
    </Link>
  )
}
