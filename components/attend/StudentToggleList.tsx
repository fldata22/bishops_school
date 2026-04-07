'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Student } from '@/lib/types'

interface Props {
  students: Student[]
  statuses: Record<string, 'present' | 'absent'>
  levels: Record<string, 1 | 2 | 3 | 4>
  onToggle: (studentId: string) => void
  onCycleLevel: (studentId: string) => void
}

const LEVEL_CONFIG = {
  1: { label: 'L1', color: 'bg-error/10 text-error border-error/20' },
  2: { label: 'L2', color: 'bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/20' },
  3: { label: 'L3', color: 'bg-primary/10 text-primary border-primary/20' },
  4: { label: 'L4', color: 'bg-secondary/10 text-secondary border-secondary/20' },
} as const

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
}

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } }
}

export default function StudentToggleList({ students, statuses, levels, onToggle, onCycleLevel }: Props) {
  return (
    <motion.div className="flex flex-col gap-2" initial="hidden" animate="visible" variants={container}>
      {students.map(student => {
        const status = statuses[student.id] ?? 'present'
        const level = levels[student.id] ?? 3
        const { label, color } = LEVEL_CONFIG[level]
        const isPresent = status === 'present'

        return (
          <motion.div key={student.id} variants={item}>
            <div className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200
              ${isPresent ? 'bg-surface-container-high border border-transparent' : 'bg-tertiary/5 border border-tertiary/20'}`}>
              <button onClick={() => onToggle(student.id)} className="flex items-center gap-3 flex-1 text-left active:scale-[0.98] transition-transform">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/20 shrink-0">
                  <Image
                    src={`https://i.pravatar.cc/80?u=${student.id}`}
                    alt={student.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex-1 text-sm font-label font-semibold text-on-surface">{student.name}</span>
              </button>

              {isPresent ? (
                <button
                  onClick={() => onCycleLevel(student.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-label font-bold border transition-all duration-150 active:scale-95 ${color}`}
                >
                  {label}
                </button>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-label font-semibold uppercase tracking-wide bg-tertiary-container/20 text-tertiary">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  Absent
                </span>
              )}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
