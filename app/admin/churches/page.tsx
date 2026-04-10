'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import {
  getChurches, getDenominations, getStudents,
  addChurch, updateChurch, deleteChurch
} from '@/lib/mock-data'
import type { Church } from '@/lib/types'

function useChurches() {
  const [, forceUpdate] = useState(0)
  const refresh = useCallback(() => forceUpdate(n => n + 1), [])
  const churches = getChurches()
  const denominations = getDenominations()
  return { churches, denominations, refresh }
}

export default function AdminChurchesPage() {
  const { churches, denominations, refresh } = useChurches()

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDenomId, setNewDenomId] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDenomId, setEditDenomId] = useState('')

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }
  const selectClass = inputClass + " cursor-pointer"

  function handleCreate() {
    if (!newName.trim() || !newDenomId) return
    addChurch(newName.trim(), newDenomId)
    setNewName('')
    setNewDenomId('')
    setShowCreate(false)
    refresh()
  }

  function startEdit(c: Church) {
    setShowCreate(false)
    setEditingId(c.id)
    setEditName(c.name)
    setEditDenomId(c.denominationId)
  }

  function handleSaveEdit() {
    if (!editingId || !editName.trim() || !editDenomId) return
    updateChurch(editingId, { name: editName.trim(), denominationId: editDenomId })
    setEditingId(null)
    refresh()
  }

  function handleDelete(id: string) {
    const studentCount = getStudents().filter(s => s.churchId === id).length
    const msg = studentCount > 0
      ? `This church has ${studentCount} student(s). Delete anyway?`
      : 'Delete this church?'
    if (!window.confirm(msg)) return
    deleteChurch(id)
    refresh()
  }

  const denomName = (id: string) => denominations.find(d => d.id === id)?.name ?? '—'

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Churches</h1>
          <button
            onClick={() => { setShowCreate(v => !v); setEditingId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            {showCreate ? 'Cancel' : '+ New Church'}
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div
            className="mb-6 p-4 rounded-xl border border-white/[0.08] flex flex-wrap gap-3 items-end"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Church Name</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. QFC New Branch"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Denomination</label>
              <select value={newDenomId} onChange={e => setNewDenomId(e.target.value)} className={selectClass} style={inputStyle}>
                <option value="">Select denomination…</option>
                {denominations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || !newDenomId}
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
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Denomination</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {churches.map(c => (
                <tr key={c.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3">
                    {editingId === c.id ? (
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    ) : (
                      <span className="font-medium text-on-surface">{c.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === c.id ? (
                      <select value={editDenomId} onChange={e => setEditDenomId(e.target.value)} className={selectClass} style={inputStyle}>
                        <option value="">Select denomination…</option>
                        {denominations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    ) : (
                      <span className="text-on-surface-variant/70 font-label">{denomName(c.denominationId)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {editingId === c.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editName.trim() || !editDenomId}
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
                            onClick={() => startEdit(c)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
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
              {churches.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-on-surface-variant/40 font-label">
                    No churches yet. Add one above.
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
