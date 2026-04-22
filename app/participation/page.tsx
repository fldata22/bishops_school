'use client'
import { useState, useEffect, useMemo } from 'react'
import { Info, CaretDown } from '@phosphor-icons/react'
import { api, ApiError } from '@/lib/api'
import type { ApiSchoolClass, ApiStudent, ApiTeacher } from '@/lib/api-types'

const LEVELS = [
  { level: 1 as const, pct: 0,  label: 'Silent',     description: 'Does not contribute or speak during meetings' },
  { level: 2 as const, pct: 25, label: 'Occasional', description: 'Contributes occasionally' },
  { level: 3 as const, pct: 50, label: 'Regular',    description: 'Contributes regularly, asks relevant questions and shows understanding of topics' },
  { level: 4 as const, pct: 75, label: 'Active',     description: 'Contributes regularly, asks questions, shows understanding and adds personal stories/experiences' },
]

const LEVEL_STYLES: Record<number, { active: string; idle: string }> = {
  1: { active: 'bg-tertiary/20 border-tertiary/40 text-tertiary-dim',   idle: 'border-white/[0.07] text-on-surface-variant/40 hover:border-tertiary/25 hover:text-tertiary-dim/70' },
  2: { active: 'bg-primary/20 border-primary/40 text-primary-dim',     idle: 'border-white/[0.07] text-on-surface-variant/40 hover:border-primary/25 hover:text-primary-dim/70' },
  3: { active: 'bg-secondary/20 border-secondary/40 text-secondary-dim', idle: 'border-white/[0.07] text-on-surface-variant/40 hover:border-secondary/25 hover:text-secondary-dim/70' },
  4: { active: 'bg-secondary/30 border-secondary/60 text-secondary-dim', idle: 'border-white/[0.07] text-on-surface-variant/40 hover:border-secondary/40 hover:text-secondary-dim/70' },
}

const selectStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}
const selectClass = 'border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary/40 transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed'

export default function ParticipationPage() {
  const [teachers, setTeachers] = useState<ApiTeacher[]>([])
  const [allClasses, setAllClasses] = useState<ApiSchoolClass[]>([])
  const [loadingBootstrap, setLoadingBootstrap] = useState(true)

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [teacherId, setTeacherId] = useState<number | ''>('')
  const [classId, setClassId] = useState<number | ''>('')

  const [students, setStudents] = useState<ApiStudent[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [levels, setLevels] = useState<Record<number, 1 | 2 | 3 | 4>>({})

  const [showKey, setShowKey] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.listTeachers(), api.listClasses()])
      .then(([t, c]) => { setTeachers(t); setAllClasses(c); setLoadingBootstrap(false) })
      .catch(() => setLoadingBootstrap(false))
  }, [])

  useEffect(() => {
    if (!classId) { setStudents([]); setLevels({}); return }
    let cancelled = false
    setLoadingStudents(true)
    Promise.all([
      api.listStudents({ class_id: Number(classId) }),
      api.getParticipation({ class_id: Number(classId), date }),
    ])
      .then(([list, existing]) => {
        if (cancelled) return
        setStudents(list)
        const prefill: Record<number, 1 | 2 | 3 | 4> = existing
          ? Object.fromEntries(existing.records.map(r => [r.student_id, r.participation_level]))
          : {}
        setLevels(prefill)
        setLoadingStudents(false)
      })
      .catch(() => { if (!cancelled) setLoadingStudents(false) })
    return () => { cancelled = true }
  }, [classId, date])

  const teacherClasses = useMemo(
    () => teacherId ? allClasses.filter(c => c.teacher_id === Number(teacherId)) : [],
    [teacherId, allClasses]
  )

  function handleTeacherChange(id: string) {
    setTeacherId(id === '' ? '' : Number(id))
    setClassId('')
    setStudents([])
    setLevels({})
    setError('')
    if (id !== '') {
      const cls = allClasses.filter(c => c.teacher_id === Number(id))
      if (cls.length === 1) setClassId(cls[0].id)
    }
  }

  async function handleSubmit() {
    if (!teacherId || !classId || !date) return
    const records = students
      .filter(s => levels[s.id] !== undefined)
      .map(s => ({ student_id: s.id, participation_level: levels[s.id] }))
    if (records.length === 0) { setError('Please grade at least one student.'); return }
    setSubmitting(true)
    setError('')
    try {
      await api.submitParticipation({ date, teacher_id: Number(teacherId), class_id: Number(classId), records })
      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setError('This data already exists for this class and date.')
      } else {
        setError(err instanceof Error ? err.message : 'Submission failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleAnother() {
    setClassId('')
    setStudents([])
    setLevels({})
    setError('')
    setSubmitted(false)
  }

  const gradedCount = Object.keys(levels).length

  if (submitted) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 gap-3 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-2 text-2xl"
          style={{ background: 'rgba(52,211,153,0.12)', boxShadow: '0 0 32px rgba(52,211,153,0.18)' }}
        >
          ✓
        </div>
        <h2 className="text-2xl font-headline font-bold text-on-surface">Participation Recorded</h2>
        <p className="text-sm font-label text-on-surface-variant/60">
          {gradedCount} student{gradedCount !== 1 ? 's' : ''} graded
        </p>
        <button
          onClick={handleAnother}
          className="mt-4 px-6 py-3 rounded-xl font-label font-semibold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          Submit Another
        </button>
      </div>
    )
  }

  if (loadingBootstrap) {
    return <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto"><p className="text-sm font-label text-on-surface-variant/60">Loading…</p></div>
  }

  return (
    <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">School Participation</p>
        <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Mark Participation</h1>
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className={selectClass}
          style={{ ...selectStyle, colorScheme: 'dark' }}
        />
      </div>

      {/* Teacher */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Teacher</label>
        <select value={teacherId} onChange={e => handleTeacherChange(e.target.value)}
          className={selectClass} style={selectStyle}>
          <option value="">Select instructor…</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Class */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Class</label>
        <select
          value={classId}
          onChange={e => { setClassId(e.target.value === '' ? '' : Number(e.target.value)); setError('') }}
          disabled={!teacherId}
          className={selectClass} style={selectStyle}
        >
          <option value="">Select class…</option>
          {teacherClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
        </select>
      </div>

      {/* Students section */}
      {(loadingStudents || students.length > 0) && (
        <>
          {/* Grading key */}
          <button
            onClick={() => setShowKey(v => !v)}
            className="w-full flex items-center gap-2 mb-3 text-left"
          >
            <Info size={14} className="text-primary-dim shrink-0" />
            <span className="text-xs font-label font-semibold text-primary-dim flex-1">Grading Key</span>
            <CaretDown
              size={12}
              weight="bold"
              className={`text-on-surface-variant/40 transition-transform duration-200 ${showKey ? 'rotate-180' : ''}`}
            />
          </button>

          {showKey && (
            <div
              className="mb-4 rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {LEVELS.map(l => {
                const style = LEVEL_STYLES[l.level]
                return (
                  <div key={l.level} className="flex items-start gap-3 px-4 py-3">
                    <span className={`text-xs font-black font-headline px-2 py-0.5 rounded-md border shrink-0 mt-0.5 ${style.active}`}>
                      {l.pct}%
                    </span>
                    <div>
                      <p className="text-xs font-bold font-label text-on-surface mb-0.5">{l.label}</p>
                      <p className="text-[11px] font-label text-on-surface-variant/60 leading-relaxed">{l.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Students header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-headline font-bold text-on-surface">Students</h2>
            {gradedCount > 0 && (
              <span className="text-xs font-label text-on-surface-variant/50">{gradedCount} of {students.length} graded</span>
            )}
          </div>

          {loadingStudents ? (
            <p className="text-sm font-label text-on-surface-variant/60">Loading students…</p>
          ) : (
            <div className="flex flex-col gap-2">
              {students.map(student => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl border border-white/[0.07]"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                >
                  <span className="text-sm font-label font-semibold text-on-surface flex-1 min-w-0 truncate">{student.name}</span>
                  <div className="flex gap-1.5 shrink-0">
                    {LEVELS.map(l => {
                      const selected = levels[student.id] === l.level
                      const style = LEVEL_STYLES[l.level]
                      return (
                        <button
                          key={l.level}
                          onClick={() => setLevels(prev => ({ ...prev, [student.id]: l.level }))}
                          title={l.description}
                          className={`w-11 py-1.5 rounded-lg border text-xs font-bold font-label transition-all duration-150 active:scale-95 ${selected ? style.active : style.idle}`}
                          style={{ background: selected ? undefined : 'rgba(255,255,255,0.02)' }}
                        >
                          {l.pct}%
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {error && <p className="mt-4 text-sm font-label text-tertiary-dim">{error}</p>}

      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={submitting || gradedCount === 0}
          className="mt-6 w-full py-4 rounded-xl font-label font-semibold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
        >
          {submitting ? 'Submitting…' : `Submit${gradedCount > 0 ? ` (${gradedCount}/${students.length})` : ''}`}
        </button>
      )}
    </div>
  )
}
