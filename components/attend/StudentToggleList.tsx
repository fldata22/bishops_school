'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ApiStudent } from '@/lib/api-types'
import StatusBadge from '@/components/ui/StatusBadge'

interface Props {
  students: ApiStudent[]
  statuses: Record<number, 'present' | 'absent'>
  onToggle: (studentId: number) => void
}

function avatarFor(student: ApiStudent) {
  if (student.image) return student.image
  const gender = student.gender === 'female' ? 'girl' : 'boy'
  return `https://avatar.iran.liara.run/public/${gender}?username=${student.id}`
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
        const isAbsent = status === 'absent'
        return (
          <motion.div key={student.id} variants={item}>
            <button
              onClick={() => onToggle(student.id)}
              className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98] border"
              style={{
                background: isAbsent ? 'rgba(244,63,94,0.06)' : 'rgba(255,255,255,0.04)',
                borderColor: isAbsent ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: isAbsent ? '0 0 12px rgba(244,63,94,0.1)' : undefined,
              }}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/[0.08] shrink-0">
                <Image
                  src={avatarFor(student)}
                  alt={student.name}
                  width={36}
                  height={36}
                  unoptimized={!!student.image}
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
