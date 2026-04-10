'use client'
import { useState, useEffect } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { api } from '@/lib/api'
import type { ApiChurch, ApiDenomination, ApiStudent } from '@/lib/api-types'

export default function AdminChurchesPage() {
  const [churches, setChurches] = useState<ApiChurch[]>([])
  const [denominations, setDenominations] = useState<ApiDenomination[]>([])
  const [students, setStudents] = useState<ApiStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDenomId, setNewDenomId] = useState<number | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDenomId, setEditDenomId] = useState<number | null>(null)

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }
  const selectClass = inputClass + " cursor-pointer"

  useEffect(() => {
    Promise.all([api.listChurches(), api.listDenominations(), api.listStudents()])
      .then(([ch, dn, st]) => { setChurches(ch); setDenominations(dn); setStudents(st) })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    if (!newName.trim() || !newDenomId) return
    try {
      const church = await api.createChurch({ name: newName.trim(), denomination_id: newDenomId })
      setChurches(prev => [...prev, church])
      setNewName('')
      setNewDenomId(null)
      setShowCreate(false)
    } catch (e) {
      setError(String(e))
    }
  }

  function startEdit(c: ApiChurch) {
    setShowCreate(false)
    setEditingId(c.id)
    setEditName(c.name)
    setEditDenomId(c.denomination_id)
  }

  async function handleSaveEdit() {
    if (!editingId || !editName.trim() || !editDenomId) return
    try {
      const updated = await api.updateChurch(editingId, { name: editName.trim(), denomination_id: editDenomId })
      setChurches(prev => prev.map(c => c.id === editingId ? updated : c))
      setEditingId(null)
    } catch (e) {
      setError(String(e))
    }
  }

  async function handleDelete(id: number) {
    const studentCount = students.filter(s => s.church_id === id).length
    const msg = studentCount > 0
      ? `This church has ${studentCount} student(s). Delete anyway?`
      : 'Delete this church?'
    if (!window.confirm(msg)) return
    try {
      await api.deleteChurch(id)
      setChurches(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      setError(String(e))
    }
  }

  const denomName = (id: number) => denominations.find(d => d.id === id)?.name ?? '—'

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

        {error && <p className="mb-4 text-sm font-label text-tertiary-dim">{error}</p>}

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
              <select
                value={newDenomId ?? ''}
                onChange={e => setNewDenomId(e.target.value === '' ? null : Number(e.target.value))}
                className={selectClass}
                style={inputStyle}
              >
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
          {loading ? (
            <p className="px-4 py-8 text-center text-on-surface-variant/40 font-label">Loading…</p>
          ) : (
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
                        <select
                          value={editDenomId ?? ''}
                          onChange={e => setEditDenomId(e.target.value === '' ? null : Number(e.target.value))}
                          className={selectClass}
                          style={inputStyle}
                        >
                          <option value="">Select denomination…</option>
                          {denominations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      ) : (
                        <span className="text-on-surface-variant/70 font-label">{denomName(c.denomination_id)}</span>
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
          )}
        </div>
      </div>
    </AdminShell>
  )
}
