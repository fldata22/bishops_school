'use client'
import { useState, useEffect } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { api } from '@/lib/api'
import type { ApiTeacher, ApiSchoolClass } from '@/lib/api-types'

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<ApiTeacher[]>([])
  const [classes, setClasses] = useState<ApiSchoolClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }

  useEffect(() => {
    Promise.all([api.listTeachers(), api.listClasses()])
      .then(([t, c]) => { setTeachers(t); setClasses(c) })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    if (!newName.trim()) return
    try {
      const teacher = await api.createTeacher({ name: newName.trim() })
      setTeachers(prev => [...prev, teacher])
      setNewName('')
      setShowCreate(false)
    } catch (e) {
      setError(String(e))
    }
  }

  function startEdit(t: ApiTeacher) {
    setShowCreate(false)
    setEditingId(t.id)
    setEditName(t.name)
  }

  async function handleSaveEdit() {
    if (!editingId || !editName.trim()) return
    try {
      const updated = await api.updateTeacher(editingId, { name: editName.trim() })
      setTeachers(prev => prev.map(t => t.id === editingId ? updated : t))
      setEditingId(null)
    } catch (e) {
      setError(String(e))
    }
  }

  async function handleDelete(id: number) {
    const assignedCount = classes.filter(c => c.teacher_id === id).length
    const msg = assignedCount > 0
      ? `This teacher is assigned to ${assignedCount} class(es). Delete anyway?`
      : 'Delete this teacher?'
    if (!window.confirm(msg)) return
    try {
      await api.deleteTeacher(id)
      setTeachers(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      setError(String(e))
    }
  }

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Teachers</h1>
          <button
            onClick={() => { setShowCreate(v => !v); setEditingId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            {showCreate ? 'Cancel' : '+ New Teacher'}
          </button>
        </div>

        {error && <p className="mb-4 text-sm font-label text-tertiary-dim">{error}</p>}

        {/* Create form */}
        {showCreate && (
          <div
            className="mb-6 p-4 rounded-xl border border-white/[0.08] flex flex-wrap gap-3 items-end"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Name</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Pastor John Doe"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
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
          {loading ? (
            <p className="px-4 py-8 text-center text-on-surface-variant/40 font-label">Loading…</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Name</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-4 py-3">
                      {editingId === t.id ? (
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className={inputClass}
                          style={inputStyle}
                        />
                      ) : (
                        <span className="font-medium text-on-surface">{t.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {editingId === t.id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              disabled={!editName.trim()}
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
                              onClick={() => startEdit(t)}
                              className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
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
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-on-surface-variant/40 font-label">
                      No teachers yet. Add one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
