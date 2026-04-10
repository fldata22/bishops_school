'use client'
import { useState, useEffect } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { api } from '@/lib/api'
import type { ApiModule, ApiBook } from '@/lib/api-types'

export default function AdminModulesPage() {
  const [modules, setModules] = useState<ApiModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Module-level state
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')

  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)
  const [editModuleName, setEditModuleName] = useState('')
  const [editModuleCode, setEditModuleCode] = useState('')

  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null)

  // Book-level state
  const [newBookName, setNewBookName] = useState('')
  const [editingBookId, setEditingBookId] = useState<number | null>(null)
  const [editBookName, setEditBookName] = useState('')
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null)

  // Chapter-level state
  const [newChapterName, setNewChapterName] = useState('')

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }

  useEffect(() => {
    api.listModules()
      .then(setModules)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  // Helper: update a single module in state
  function updateModuleInState(updated: ApiModule) {
    setModules(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  // Helper: update a single book within its module in state
  function updateBookInState(moduleId: number, updatedBook: ApiBook) {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m
      return { ...m, books: m.books.map(b => b.id === updatedBook.id ? updatedBook : b) }
    }))
  }

  async function handleCreateModule() {
    if (!newName.trim() || !newCode.trim()) return
    try {
      const created = await api.createModule({ name: newName.trim(), code: newCode.trim() })
      setModules(prev => [...prev, created])
      setNewName(''); setNewCode(''); setShowCreate(false)
    } catch (e) {
      setError(String(e))
    }
  }

  function startEditModule(id: number, name: string, code: string) {
    setShowCreate(false)
    setEditingModuleId(id); setEditModuleName(name); setEditModuleCode(code)
  }

  async function handleSaveModule() {
    if (!editingModuleId || !editModuleName.trim() || !editModuleCode.trim()) return
    try {
      const updated = await api.updateModule(editingModuleId, {
        name: editModuleName.trim(),
        code: editModuleCode.trim(),
      })
      updateModuleInState(updated)
      setEditingModuleId(null)
    } catch (e) {
      setError(String(e))
    }
  }

  async function handleDeleteModule(id: number) {
    if (!window.confirm('Delete this module? All books and chapters will be removed.')) return
    try {
      await api.deleteModule(id)
      setModules(prev => prev.filter(m => m.id !== id))
      if (expandedModuleId === id) setExpandedModuleId(null)
    } catch (e) {
      setError(String(e))
    }
  }

  function toggleModuleExpand(id: number) {
    setExpandedModuleId(v => v === id ? null : id)
    setExpandedBookId(null)
    setNewBookName('')
    setEditingBookId(null)
    setNewChapterName('')
  }

  async function handleAddBook(moduleId: number) {
    if (!newBookName.trim()) return
    try {
      const book = await api.createBook(moduleId, { name: newBookName.trim(), chapters: [] })
      setModules(prev => prev.map(m => {
        if (m.id !== moduleId) return m
        return { ...m, books: [...m.books, book] }
      }))
      setNewBookName('')
    } catch (e) {
      setError(String(e))
    }
  }

  function startEditBook(bookId: number, name: string) {
    setEditingBookId(bookId); setEditBookName(name)
  }

  async function handleSaveBook(moduleId: number, bookId: number) {
    if (!editBookName.trim()) return
    try {
      const updated = await api.updateBook(bookId, { name: editBookName.trim() })
      updateBookInState(moduleId, updated)
      setEditingBookId(null)
    } catch (e) {
      setError(String(e))
    }
  }

  async function handleDeleteBook(moduleId: number, bookId: number) {
    if (!window.confirm('Delete this book and all its chapters?')) return
    try {
      await api.deleteBook(bookId)
      setModules(prev => prev.map(m => {
        if (m.id !== moduleId) return m
        return { ...m, books: m.books.filter(b => b.id !== bookId) }
      }))
      if (expandedBookId === bookId) setExpandedBookId(null)
    } catch (e) {
      setError(String(e))
    }
  }

  function toggleBookExpand(bookId: number) {
    setExpandedBookId(v => v === bookId ? null : bookId)
    setNewChapterName('')
  }

  async function handleAddChapter(moduleId: number, book: ApiBook) {
    if (!newChapterName.trim()) return
    const newChapters = [...book.chapters, newChapterName.trim()]
    try {
      const updated = await api.updateBook(book.id, { chapters: newChapters })
      updateBookInState(moduleId, updated)
      setNewChapterName('')
    } catch (e) {
      setError(String(e))
    }
  }

  async function handleDeleteChapter(moduleId: number, book: ApiBook, index: number) {
    const newChapters = book.chapters.filter((_, i) => i !== index)
    try {
      const updated = await api.updateBook(book.id, { chapters: newChapters })
      updateBookInState(moduleId, updated)
    } catch (e) {
      setError(String(e))
    }
  }

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Modules</h1>
          <button
            onClick={() => { setShowCreate(v => !v); setEditingModuleId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            {showCreate ? 'Cancel' : '+ New Module'}
          </button>
        </div>

        {error && <p className="mb-4 text-sm font-label text-tertiary-dim">{error}</p>}

        {/* Create module form */}
        {showCreate && (
          <div
            className="mb-6 p-4 rounded-xl border border-white/[0.08] flex flex-wrap gap-3 items-end"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Module Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Loyalty" className={inputClass} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Code</label>
              <input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="e.g. L" className={`${inputClass} w-20`} style={inputStyle} />
            </div>
            <button
              onClick={handleCreateModule}
              disabled={!newName.trim() || !newCode.trim()}
              className="px-4 py-1.5 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        )}

        {/* Module list */}
        {loading ? (
          <p className="px-4 py-8 text-center text-on-surface-variant/40 font-label">Loading…</p>
        ) : (
          <div className="space-y-2">
            {modules.map(mod => (
              <div
                key={mod.id}
                className="rounded-xl border border-white/[0.08] overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                {/* Module row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-[10px] font-label font-bold text-primary-dim bg-primary/10 border border-primary/20 rounded px-2 py-0.5 shrink-0">
                    {editingModuleId === mod.id
                      ? <input value={editModuleCode} onChange={e => setEditModuleCode(e.target.value)} className={`${inputClass} w-12 text-center text-[10px] py-0`} style={inputStyle} />
                      : mod.code
                    }
                  </span>
                  <div className="flex-1 min-w-0">
                    {editingModuleId === mod.id ? (
                      <input value={editModuleName} onChange={e => setEditModuleName(e.target.value)} className={`${inputClass} w-full`} style={inputStyle} />
                    ) : (
                      <span className="font-medium text-on-surface">{mod.name}</span>
                    )}
                  </div>
                  <span className="text-xs font-label text-on-surface-variant/40 shrink-0">{mod.books.length} book{mod.books.length !== 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {editingModuleId === mod.id ? (
                      <>
                        <button
                          onClick={handleSaveModule}
                          disabled={!editModuleName.trim() || !editModuleCode.trim()}
                          className="px-3 py-1 rounded-lg text-xs font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 transition-colors"
                        >
                          Save
                        </button>
                        <button onClick={() => setEditingModuleId(null)} className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] transition-colors">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleModuleExpand(mod.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-label border transition-colors ${expandedModuleId === mod.id ? 'bg-secondary/10 text-secondary-dim border-secondary/20' : 'text-on-surface-variant/60 border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface'}`}
                        >
                          Books
                        </button>
                        <button
                          onClick={() => startEditModule(mod.id, mod.name, mod.code)}
                          className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteModule(mod.id)}
                          className="px-3 py-1 rounded-lg text-xs font-label text-tertiary/60 border border-tertiary/20 hover:bg-tertiary/10 hover:text-tertiary transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Book panel */}
                {expandedModuleId === mod.id && (
                  <div className="border-t border-white/[0.06] px-4 py-4" style={{ background: 'rgba(255,255,255,0.015)' }}>
                    {/* Add book form */}
                    <div className="flex gap-2 mb-3">
                      <input
                        value={newBookName}
                        onChange={e => setNewBookName(e.target.value)}
                        placeholder="Book name…"
                        className={`${inputClass} flex-1`}
                        style={inputStyle}
                      />
                      <button
                        onClick={() => handleAddBook(mod.id)}
                        disabled={!newBookName.trim()}
                        className="px-3 py-1.5 rounded-lg text-xs font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 transition-colors"
                      >
                        + Add Book
                      </button>
                    </div>

                    {/* Book list */}
                    {mod.books.length === 0 && (
                      <p className="text-xs text-on-surface-variant/35 font-label py-2">No books yet. Add one above.</p>
                    )}
                    <div className="space-y-1">
                      {mod.books.map(book => (
                        <div key={book.id}>
                          {/* Book row */}
                          <div className="flex items-center gap-2 py-2">
                            <div className="flex-1 min-w-0">
                              {editingBookId === book.id ? (
                                <input value={editBookName} onChange={e => setEditBookName(e.target.value)} className={`${inputClass} w-full`} style={inputStyle} />
                              ) : (
                                <span className="text-sm text-on-surface/80 font-label">{book.name}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-on-surface-variant/35 font-label shrink-0">{book.chapters.length} ch</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {editingBookId === book.id ? (
                                <>
                                  <button
                                    onClick={() => handleSaveBook(mod.id, book.id)}
                                    disabled={!editBookName.trim()}
                                    className="px-2.5 py-0.5 rounded text-[10px] font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button onClick={() => setEditingBookId(null)} className="px-2.5 py-0.5 rounded text-[10px] font-label text-on-surface-variant/60 border border-white/[0.06] transition-colors">
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => toggleBookExpand(book.id)}
                                    className={`px-2.5 py-0.5 rounded text-[10px] font-label border transition-colors ${expandedBookId === book.id ? 'bg-secondary/10 text-secondary-dim border-secondary/20' : 'text-on-surface-variant/50 border-white/[0.06] hover:text-on-surface'}`}
                                  >
                                    Chapters
                                  </button>
                                  <button onClick={() => startEditBook(book.id, book.name)} className="px-2.5 py-0.5 rounded text-[10px] font-label text-on-surface-variant/50 border border-white/[0.06] hover:text-on-surface transition-colors">
                                    Edit
                                  </button>
                                  <button onClick={() => handleDeleteBook(mod.id, book.id)} className="px-2.5 py-0.5 rounded text-[10px] font-label text-tertiary/50 border border-tertiary/15 hover:text-tertiary hover:bg-tertiary/10 transition-colors">
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Chapter panel */}
                          {expandedBookId === book.id && (
                            <div className="pl-4 pb-3">
                              {/* Add chapter */}
                              <div className="flex gap-2 mb-2">
                                <input
                                  value={newChapterName}
                                  onChange={e => setNewChapterName(e.target.value)}
                                  placeholder="Chapter name…"
                                  className={`${inputClass} flex-1 text-xs`}
                                  style={inputStyle}
                                />
                                <button
                                  onClick={() => handleAddChapter(mod.id, book)}
                                  disabled={!newChapterName.trim()}
                                  className="px-2.5 py-1 rounded text-[10px] font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 disabled:opacity-40 transition-colors"
                                >
                                  + Add
                                </button>
                              </div>
                              {/* Chapter pills */}
                              {book.chapters.length === 0 && (
                                <p className="text-[10px] text-on-surface-variant/30 font-label">No chapters yet.</p>
                              )}
                              <div className="flex flex-wrap gap-1.5">
                                {book.chapters.map((ch, idx) => (
                                  <span
                                    key={idx}
                                    className="flex items-center gap-1 text-[10px] font-label text-on-surface-variant/60 bg-white/[0.04] border border-white/[0.06] rounded-full px-2.5 py-1"
                                  >
                                    {ch}
                                    <button
                                      onClick={() => handleDeleteChapter(mod.id, book, idx)}
                                      className="text-on-surface-variant/30 hover:text-tertiary transition-colors ml-0.5"
                                      aria-label={`Delete chapter ${ch}`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {modules.length === 0 && (
              <div className="rounded-xl border border-white/[0.08] px-4 py-8 text-center text-on-surface-variant/40 font-label" style={{ background: 'rgba(255,255,255,0.025)' }}>
                No modules yet. Add one above.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
