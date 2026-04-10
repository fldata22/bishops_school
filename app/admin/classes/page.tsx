'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import {
  getClasses, getTeachers, getStudentsByClass,
  addClass, updateClass, deleteClass
} from '@/lib/mock-data'
import type { Class } from '@/lib/types'

function useClasses() {
  const [, forceUpdate] = useState(0)
  const refresh = useCallback(() => forceUpdate(n => n + 1), [])

  const classes = getClasses()
  const teachers = getTeachers()

  return { classes, teachers, refresh }
}

export default function AdminClassesPage() {
  const { classes, teachers, refresh } = useClasses()

  // Create form state
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTeacherId, setNewTeacherId] = useState('')

  // Edit state: which row is being edited
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editTeacherId, setEditTeacherId] = useState('')

  function handleCreate() {
    if (!newName.trim() || !newTeacherId) return
    addClass(newName.trim(), newTeacherId)
    setNewName('')
    setNewTeacherId('')
    setShowCreate(false)
    refresh()
  }

  function startEdit(cls: Class) {
    setEditingId(cls.id)
    setEditName(cls.name)
    setEditTeacherId(cls.teacherId)
  }

  function handleSaveEdit() {
    if (!editingId || !editName.trim() || !editTeacherId) return
    updateClass(editingId, { name: editName.trim(), teacherId: editTeacherId })
    setEditingId(null)
    refresh()
  }

  function handleDelete(id: string) {
    deleteClass(id)
    refresh()
  }

  const teacherName = (id: string) => teachers.find(t => t.id === id)?.name ?? '—'
  const studentCount = (id: string) => getStudentsByClass(id).length

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }
  const selectClass = inputClass + " cursor-pointer"

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Classes</h1>
          <button
            onClick={() => { setShowCreate(v => !v); setEditingId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            {showCreate ? 'Cancel' : '+ New Class'}
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div
            className="mb-6 p-4 rounded-xl border border-white/[0.08] flex flex-wrap gap-3 items-end"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Class Name</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Makarios"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Teacher</label>
              <select value={newTeacherId} onChange={e => setNewTeacherId(e.target.value)} className={selectClass} style={inputStyle}>
                <option value="">Select teacher…</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || !newTeacherId}
              className="px-4 py-1.5 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        )}

        {/* Table */}
        <div
          className="rounded-xl border border-white/[0.08] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Name</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Teacher</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Students</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3">
                    {editingId === cls.id ? (
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    ) : (
                      <span className="font-medium text-on-surface">{cls.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === cls.id ? (
                      <select value={editTeacherId} onChange={e => setEditTeacherId(e.target.value)} className={selectClass} style={inputStyle}>
                        <option value="">Select teacher…</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    ) : (
                      <span className="text-on-surface-variant/70 font-label">{teacherName(cls.teacherId)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-on-surface-variant/60 font-label">{studentCount(cls.id)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {editingId === cls.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editName.trim() || !editTeacherId}
                            className="px-3 py-1 rounded-lg text-xs font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(cls)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cls.id)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-tertiary/60 border border-tertiary/20 hover:bg-tertiary/10 hover:text-tertiary transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-on-surface-variant/40 font-label">
                    No classes yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
