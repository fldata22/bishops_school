'use client'
import { useState, useEffect, useMemo } from 'react'
import { api } from '@/lib/api'
import type { ApiModule, ApiSchoolClass, ApiStudent, ApiTeacher } from '@/lib/api-types'
import StudentToggleList from '@/components/attend/StudentToggleList'
import SuccessScreen from '@/components/attend/SuccessScreen'

const selectStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}

const selectClass = 'border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary/40 transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed'

export default function AttendPage() {
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
  const [statuses, setStatuses] = useState<Record<number, 'present' | 'absent'>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedClassName, setSubmittedClassName] = useState('')

  // Bootstrap: fetch teachers, classes, modules on mount.
  useEffect(() => {
    let cancelled = false
    Promise.all([api.listTeachers(), api.listClasses(), api.listModules()])
      .then(([t, c, m]) => {
        if (cancelled) return
        setTeachers(t)
        setAllClasses(c)
        setAllModules(m)
        setLoadingBootstrap(false)
      })
      .catch(err => {
        if (cancelled) return
        setBootstrapError(err.message ?? 'Failed to load data')
        setLoadingBootstrap(false)
      })
    return () => { cancelled = true }
  }, [])

  // Fetch students when class changes.
  useEffect(() => {
    if (!classId) {
      setStudents([])
      setStatuses({})
      return
    }
    let cancelled = false
    api.listStudents({ class_id: Number(classId) })
      .then(list => {
        if (cancelled) return
        setStudents(list)
        setStatuses(Object.fromEntries(list.map(s => [s.id, 'present'])))
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message ?? 'Failed to load students')
      })
    return () => { cancelled = true }
  }, [classId])

  const teacherClasses = useMemo(() => {
    if (!teacherId) return []
    return allClasses.filter(c => c.teacher_id === Number(teacherId))
  }, [teacherId, allClasses])

  const selectedModule = useMemo(() => {
    if (!moduleId) return undefined
    return allModules.find(m => m.id === Number(moduleId))
  }, [moduleId, allModules])

  const moduleBooks = selectedModule?.books ?? []

  const selectedBook = useMemo(() => {
    if (!bookId) return undefined
    return moduleBooks.find(b => b.id === Number(bookId))
  }, [bookId, moduleBooks])

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

  function handleClassChange(id: string) {
    const num = id === '' ? '' : Number(id)
    setClassId(num)
    setModuleId('')
    setBookId('')
    setChapterIndex('')
    setError('')
  }

  function handleModuleChange(id: string) {
    setModuleId(id === '' ? '' : Number(id))
    setBookId('')
    setChapterIndex('')
    setError('')
  }

  function handleBookChange(id: string) {
    setBookId(id === '' ? '' : Number(id))
    setChapterIndex('')
    setError('')
  }

  function toggleStudent(studentId: number) {
    setStatuses(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }))
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
          status: statuses[s.id] ?? 'present',
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
    setStatuses({})
    setStudents([])
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

  const presentCount = Object.values(statuses).filter(s => s === 'present').length
  const absentCount = Object.values(statuses).filter(s => s === 'absent').length

  return (
    <div className="min-h-[100dvh] px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-label text-on-surface-variant/60 uppercase tracking-widest mb-1">School Attendance</p>
        <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Mark Attendance</h1>
      </div>

      {/* Teacher selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Teacher</label>
        <select value={teacherId} onChange={e => handleTeacherChange(e.target.value)}
          className={selectClass} style={selectStyle}>
          <option value="">Select instructor…</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Class selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Class</label>
        <select value={classId} onChange={e => handleClassChange(e.target.value)}
          disabled={!teacherId} className={selectClass} style={selectStyle}>
          <option value="">Select class…</option>
          {teacherClasses.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Module selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Module</label>
        <select value={moduleId} onChange={e => handleModuleChange(e.target.value)}
          disabled={!classId} className={selectClass} style={selectStyle}>
          <option value="">Select module…</option>
          {allModules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Book selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Book</label>
        <select value={bookId} onChange={e => handleBookChange(e.target.value)}
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

      {/* Student list */}
      {students.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-headline font-bold text-on-surface">Students</h2>
            <div className="flex gap-3 text-xs font-label">
              <span className="text-secondary-dim">{presentCount} present</span>
              <span className="text-tertiary-dim">{absentCount} absent</span>
            </div>
          </div>
          <StudentToggleList students={students} statuses={statuses} onToggle={toggleStudent} />
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
          {submitting ? 'Submitting…' : 'Submit Session'}
        </button>
      )}
    </div>
  )
}
