'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Student } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'

interface Props {
  students: Student[]
  statuses: Record<string, 'present' | 'absent'>
  onToggle: (studentId: string) => void
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
}

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } }
}

export default function StudentToggleList({ students, statuses, onToggle }: Props) {
  return (
    <motion.div className="flex flex-col gap-2" initial="hidden" animate="visible" variants={container}>
      {students.map(student => {
        const status = statuses[student.id] ?? 'present'
        return (
          <motion.div key={student.id} variants={item}>
            <button onClick={() => onToggle(student.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98]
                ${status === 'absent' ? 'bg-tertiary/5 border border-tertiary/20' : 'bg-surface-container-high border border-transparent hover:bg-surface-bright'}`}>
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
              <StatusBadge status={status} />
            </button>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
