'use client'
import { useState, useEffect, useMemo } from 'react'
import { api } from '@/lib/api'
import type { ApiModule, ApiSchoolClass, ApiStudent, ApiTeacher } from '@/lib/api-types'
import SuccessScreen from '@/components/attend/SuccessScreen'

const selectStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}

const selectClass = 'border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary/40 transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed'

const PARTICIPATION_LEVELS: Array<{ value: 1 | 2 | 3 | 4; label: string; color: string }> = [
  { value: 1, label: 'Quiet',     color: 'rgba(251,113,133,0.2)' },
  { value: 2, label: 'Listening', color: 'rgba(167,139,250,0.2)' },
  { value: 3, label: 'Engaged',   color: 'rgba(34,211,238,0.2)' },
  { value: 4, label: 'Leading',   color: 'rgba(34,211,238,0.35)' },
]

export default function ParticipationPage() {
  const [teachers, setTeachers] = useState<ApiTeacher[]>([])
  const [allClasses, setAllClasses] = useState<ApiSchoolClass[]>([])
  const [allModules, setAllModules] = useState<ApiModule[]>([])
  const [loadingBootstrap, setLoadingBootstrap] = useState(true)
  const [bootstrapError, setBootstrapError] = useState('')

  const [teacherId, setTeacherId] = useState<number | ''>('')
  const [classId, setClassId] = useState<number | ''>('')
  const [moduleId, setModuleId] = useState<number | ''>('')
  const [bookId, setBookId] = useState<number | ''>('')
  const [chapterIndex, setChapterIndex] = useState<number | ''>('')

  const [students, setStudents] = useState<ApiStudent[]>([])
  const [participation, setParticipation] = useState<Record<number, 1 | 2 | 3 | 4>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedClassName, setSubmittedClassName] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listTeachers(), api.listClasses(), api.listModules()])
      .then(([t, c, m]) => {
        if (cancelled) return
        setTeachers(t); setAllClasses(c); setAllModules(m); setLoadingBootstrap(false)
      })
      .catch(err => {
        if (cancelled) return
        setBootstrapError(err.message ?? 'Failed to load data')
        setLoadingBootstrap(false)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!classId) {
      setStudents([])
      setParticipation({})
      return
    }
    let cancelled = false
    api.listStudents({ class_id: Number(classId) })
      .then(list => {
        if (cancelled) return
        setStudents(list)
        // Default everyone to "Engaged" (3)
        setParticipation(Object.fromEntries(list.map(s => [s.id, 3])))
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message ?? 'Failed to load students')
      })
    return () => { cancelled = true }
  }, [classId])

  const teacherClasses = useMemo(
    () => teacherId ? allClasses.filter(c => c.teacher_id === Number(teacherId)) : [],
    [teacherId, allClasses]
  )

  const selectedModule = useMemo(
    () => moduleId ? allModules.find(m => m.id === Number(moduleId)) : undefined,
    [moduleId, allModules]
  )
  const moduleBooks = selectedModule?.books ?? []

  const selectedBook = useMemo(
    () => bookId ? moduleBooks.find(b => b.id === Number(bookId)) : undefined,
    [bookId, moduleBooks]
  )
  const bookChapters = selectedBook?.chapters ?? []

  function handleTeacherChange(id: string) {
    const num = id === '' ? '' : Number(id)
    setTeacherId(num)
    setClassId('')
    setModuleId('')
    setBookId('')
    setChapterIndex('')
    setError('')
    if (num !== '') {
      const classes = allClasses.filter(c => c.teacher_id === num)
      if (classes.length === 1) {
        setClassId(classes[0].id)
      }
    }
  }

  function setLevel(studentId: number, level: 1 | 2 | 3 | 4) {
    setParticipation(prev => ({ ...prev, [studentId]: level }))
  }

  async function handleSubmit() {
    if (!teacherId || !classId || !moduleId || !bookId || chapterIndex === '') return
    setSubmitting(true)
    setError('')
    try {
      await api.createSession({
        class_id: Number(classId),
        module_id: Number(moduleId),
        teacher_id: Number(teacherId),
        date: new Date().toISOString().split('T')[0],
        book_id: Number(bookId),
        chapter_index: Number(chapterIndex),
        attendance: students.map(s => ({
          student_id: s.id,
          status: 'present',
          participation_level: participation[s.id] ?? 3,
        })),
      })
      const cls = allClasses.find(c => c.id === Number(classId))
      setSubmittedClassName(cls?.name ?? '')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmitAnother() {
    setClassId('')
    setModuleId('')
    setBookId('')
    setChapterIndex('')
    setStudents([])
    setParticipation({})
    setError('')
    setSubmitted(false)
    setSubmittedClassName('')
  }

  const teacher = teachers.find(t => t.id === Number(teacherId))

  if (submitted) {
    return (
      <SuccessScreen
        teacherName={teacher?.name ?? ''}
        courseName={submittedClassName}
        onSubmitAnother={handleSubmitAnother}
      />
    )
  }

  if (loadingBootstrap) {
    return (
      <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
        <p className="text-sm font-label text-on-surface-variant/60">Loading…</p>
      </div>
    )
  }

  if (bootstrapError) {
    return (
      <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
        <p className="text-sm font-label text-tertiary-dim">Error: {bootstrapError}</p>
      </div>
    )
  }

  const distribution = PARTICIPATION_LEVELS.map(({ value }) => ({
    value,
    count: Object.values(participation).filter(p => p === value).length,
  }))

  return (
    <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">School Attendance</p>
        <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Score Participation</h1>
        <p className="text-xs font-label text-on-surface-variant/60 mt-1">Rate each student 1–4 based on how they participated.</p>
      </div>

      {/* Teacher selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Teacher</label>
        <select value={teacherId} onChange={e => handleTeacherChange(e.target.value)} className={selectClass} style={selectStyle}>
          <option value="">Select instructor…</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Class selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Class</label>
        <select value={classId}
          onChange={e => { setClassId(e.target.value === '' ? '' : Number(e.target.value)); setModuleId(''); setBookId(''); setChapterIndex(''); setError('') }}
          disabled={!teacherId} className={selectClass} style={selectStyle}>
          <option value="">Select class…</option>
          {teacherClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
        </select>
      </div>

      {/* Module selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Module</label>
        <select value={moduleId}
          onChange={e => { setModuleId(e.target.value === '' ? '' : Number(e.target.value)); setBookId(''); setChapterIndex(''); setError('') }}
          disabled={!classId} className={selectClass} style={selectStyle}>
          <option value="">Select module…</option>
          {allModules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Book selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Book</label>
        <select value={bookId}
          onChange={e => { setBookId(e.target.value === '' ? '' : Number(e.target.value)); setChapterIndex(''); setError('') }}
          disabled={!moduleId} className={selectClass} style={selectStyle}>
          <option value="">Select book…</option>
          {moduleBooks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Chapter selector */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Chapter</label>
        <select value={chapterIndex}
          onChange={e => { setChapterIndex(e.target.value === '' ? '' : Number(e.target.value)); setError('') }}
          disabled={!bookId || bookChapters.length === 0} className={selectClass} style={selectStyle}>
          <option value="">Select chapter…</option>
          {bookChapters.map((chapter, i) => <option key={i} value={i}>{chapter}</option>)}
        </select>
      </div>

      {/* Student list with participation pickers */}
      {students.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-headline font-bold text-on-surface">Students</h2>
            <div className="flex gap-2 text-[10px] font-label">
              {distribution.map(d => (
                <span key={d.value} className="text-on-surface-variant/60">{d.value}: {d.count}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {students.map(student => {
              const current = participation[student.id] ?? 3
              return (
                <div
                  key={student.id}
                  className="rounded-xl p-3 border border-white/[0.07]"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                >
                  <p className="text-sm font-label font-semibold text-on-surface mb-2 truncate">{student.name}</p>
                  <div className="flex gap-1.5">
                    {PARTICIPATION_LEVELS.map(({ value, label, color }) => {
                      const active = current === value
                      return (
                        <button
                          key={value}
                          onClick={() => setLevel(student.id, value)}
                          className={`flex-1 py-2 rounded-lg text-xs font-label font-semibold transition-all border ${active ? 'text-on-surface' : 'text-on-surface-variant/45 border-white/[0.06] hover:text-on-surface/70'}`}
                          style={active ? { background: color, borderColor: 'rgba(255,255,255,0.2)' } : { background: 'rgba(255,255,255,0.02)' }}
                        >
                          <span className="block text-[10px] opacity-60">{value}</span>
                          <span className="block">{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {error && <p className="mt-4 text-sm font-label text-tertiary-dim">{error}</p>}

      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={chapterIndex === '' || !bookId || submitting}
          className="mt-6 w-full py-4 rounded-xl font-label font-semibold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
        >
          {submitting ? 'Submitting…' : 'Submit Participation'}
        </button>
      )}
    </div>
  )
}
