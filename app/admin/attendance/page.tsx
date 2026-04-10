'use client'
import { useState, useEffect, useMemo } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { api } from '@/lib/api'
import type { ApiSession, ApiSchoolClass, ApiTeacher, ApiModule, ApiAttendanceRecord, ApiStudent } from '@/lib/api-types'

interface SessionRowProps {
  session: ApiSession
  classes: ApiSchoolClass[]
  modules: ApiModule[]
  teachers: ApiTeacher[]
  onDelete: (id: number) => void
}

interface FullSession extends ApiSession {
  attendance_records: ApiAttendanceRecord[]
}

function SessionRow({ session, classes, modules, teachers, onDelete }: SessionRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [full, setFull] = useState<FullSession | null>(null)
  const [students, setStudents] = useState<Record<number, ApiStudent>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const className = classes.find(c => c.id === session.class_id)?.name ?? '?'
  const moduleObj = modules.find(m => m.id === session.module_id)
  const teacherName = teachers.find(t => t.id === session.teacher_id)?.name ?? '?'
  const book = moduleObj?.books.find(b => b.id === session.book_id)
  const chapterName = book?.chapters[session.chapter_index] ?? `Chapter ${session.chapter_index + 1}`

  async function loadDetail() {
    setLoading(true)
    setError(null)
    try {
      const detail = await api.getSession(session.id)
      setFull(detail as FullSession)
      // Fetch students for the class so we can show names
      const list = await api.listStudents({ class_id: session.class_id })
      setStudents(Object.fromEntries(list.map(s => [s.id, s])))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  function toggle() {
    if (!expanded && !full) {
      loadDetail()
    }
    setExpanded(v => !v)
  }

  async function toggleStatus(record: ApiAttendanceRecord) {
    const newStatus = record.status === 'present' ? 'absent' : 'present'
    try {
      const updated = await api.updateAttendance(record.id, { status: newStatus })
      setFull(prev => prev ? {
        ...prev,
        attendance_records: prev.attendance_records.map(r => r.id === record.id ? { ...r, ...updated } : r),
      } : prev)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="rounded-xl border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.025)' }}>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface text-sm">{className} · {moduleObj?.name ?? '?'}</p>
          <p className="text-xs text-on-surface-variant/60 font-label mt-0.5">
            {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' · '}
            {teacherName}
            {book && ` · ${book.name} › ${chapterName}`}
          </p>
        </div>
        <span className="text-xs text-on-surface-variant/40 font-label shrink-0">
          {expanded ? '▼' : '▶'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] p-4 space-y-3">
          {loading && <p className="text-sm font-label text-on-surface-variant/60">Loading…</p>}
          {error && <p className="text-sm font-label text-tertiary-dim">{error}</p>}
          {full && (
            <>
              <div className="space-y-1">
                {full.attendance_records.map(record => {
                  const studentName = students[record.student_id]?.name ?? `Student #${record.student_id}`
                  const isPresent = record.status === 'present'
                  return (
                    <button
                      key={record.id}
                      onClick={() => toggleStatus(record)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left text-sm border transition-colors"
                      style={{
                        background: isPresent ? 'rgba(6,182,212,0.06)' : 'rgba(244,63,94,0.06)',
                        borderColor: isPresent ? 'rgba(6,182,212,0.2)' : 'rgba(244,63,94,0.2)',
                      }}
                    >
                      <span className="font-label text-on-surface truncate">{studentName}</span>
                      <span className={`text-[10px] font-label font-bold uppercase ${isPresent ? 'text-secondary-dim' : 'text-tertiary-dim'}`}>
                        {record.status}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between pt-3 border-t border-white/[0.04]">
                <p className="text-[10px] text-on-surface-variant/40 font-label uppercase tracking-wider">
                  Tap a row to flip present/absent
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this session and all its attendance records?')) {
                      onDelete(session.id)
                    }
                  }}
                  className="text-xs text-tertiary/70 hover:text-tertiary font-label border border-tertiary/20 px-3 py-1 rounded-lg hover:bg-tertiary/10 transition-colors"
                >
                  Delete Session
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminAttendancePage() {
  const [sessions, setSessions] = useState<ApiSession[]>([])
  const [classes, setClasses] = useState<ApiSchoolClass[]>([])
  const [modules, setModules] = useState<ApiModule[]>([])
  const [teachers, setTeachers] = useState<ApiTeacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [classFilter, setClassFilter] = useState<number | ''>('')
  const [moduleFilter, setModuleFilter] = useState<number | ''>('')

  useEffect(() => {
    Promise.all([
      api.listSessions(),
      api.listClasses(),
      api.listModules(),
      api.listTeachers(),
    ])
      .then(([s, c, m, t]) => { setSessions(s); setClasses(c); setModules(m); setTeachers(t) })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return sessions
      .filter(s => !classFilter || s.class_id === Number(classFilter))
      .filter(s => !moduleFilter || s.module_id === Number(moduleFilter))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [sessions, classFilter, moduleFilter])

  async function handleDelete(id: number) {
    try {
      await api.deleteSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const inputClass = 'rounded-lg px-3 py-2 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label w-full'
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }

  return (
    <AdminShell>
      <div className="px-4 py-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Attendance</h1>
        </div>

        {error && <p className="mb-4 text-sm font-label text-tertiary-dim">{error}</p>}

        {/* Filters */}
        <div className="mb-6 p-4 rounded-xl border border-white/[0.08] flex flex-col md:flex-row md:flex-wrap gap-3 md:items-end" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Class</label>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value === '' ? '' : Number(e.target.value))} className={inputClass} style={inputStyle}>
              <option value="">All classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Module</label>
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value === '' ? '' : Number(e.target.value))} className={inputClass} style={inputStyle}>
              <option value="">All modules</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        {/* Sessions list */}
        {loading ? (
          <p className="text-center py-8 text-on-surface-variant/40 font-label">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-on-surface-variant/40 font-label">
            No sessions found. Submit a session via the Take Attendance page.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map(s => (
              <SessionRow key={s.id} session={s} classes={classes} modules={modules} teachers={teachers} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
