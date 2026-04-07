import type { Course } from '@/lib/types'
import Link from 'next/link'
import { TreeStructure, Cpu, Cloud, Palette, ChartLine, Users } from '@phosphor-icons/react/dist/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PhosphorIcon = React.ForwardRefExoticComponent<any>

interface Props { course: Course; avgRate: number; teacherName?: string }

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

const iconMap: Record<string, PhosphorIcon> = {
  c1: TreeStructure,
  c2: Cpu,
  c3: Cloud,
  c4: Palette,
  c5: ChartLine,
}

export default function CourseCard({ course, avgRate, teacherName }: Props) {
  const rate = avgRate
  const iconColors =
    rate >= 80
      ? 'bg-primary/10 text-primary'
      : rate >= 65
      ? 'bg-tertiary/10 text-tertiary'
      : 'bg-error/10 text-error'

  const Icon = iconMap[course.id] ?? TreeStructure

  const progressFill = rate >= 80 ? 'bg-secondary' : rate >= 65 ? 'bg-tertiary' : 'bg-error'
  const rateColor = rate >= 80 ? 'text-secondary' : rate >= 65 ? 'text-tertiary' : 'text-error'

  return (
    <Link
      href={`/courses/${course.id}`}
      className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 flex flex-col gap-6 hover:bg-surface-container-highest transition-all duration-300 group"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconColors}`}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Attendance</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-surface-container-lowest rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${progressFill}`}
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
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-label">
            <Users size={14} />
            <span>{teacherName}</span>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="border-t border-outline-variant/10 pt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant font-label">Meeting Days</span>
          <span className="text-sm font-medium text-on-surface font-label">{course.schedule.days.join(', ')}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-tighter font-bold text-on-surface-variant font-label">Time Slot</span>
          <span className="text-sm font-medium text-on-surface font-label">{formatTime(course.schedule.time)}</span>
        </div>
      </div>
    </Link>
  )
}
