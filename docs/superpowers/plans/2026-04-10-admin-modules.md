# Admin: Modules CRUD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full CRUD for Modules (including nested Books and Chapters) in the admin panel at `/app/admin/modules`.

**Architecture:** Add a runtime mutation layer for modules to `lib/mock-data.ts`, then build a client-side page with a 3-level nested UI: modules expand to show books, books expand to show chapters. All state is in-memory. The `getModuleById` function must be updated (not made private) since it is consumed by 3 other pages.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind CSS, `@phosphor-icons/react`, in-memory mock data.

**Can implement in any order** relative to Teachers/Churches/Students — it touches different parts of `lib/mock-data.ts`. However, still implement sequentially with the others (don't run this plan concurrently with another plan that also edits `lib/mock-data.ts`).

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/mock-data.ts` | Modify | Add module runtime arrays; replace `getModules()`, `getAllModules()`, `getModuleById()`, `getCourses()`, `getCourseById()` with runtime-aware versions; add module + book + chapter CRUD functions |
| `app/admin/modules/page.tsx` | Create | 3-level nested CRUD page |

---

### Task 1: Add Modules runtime mutation layer to `lib/mock-data.ts`

**Files:**
- Modify: `lib/mock-data.ts`

**Context:**
- After previous plans run, the runtime block has entries for runtimeSessions, runtimeAttendance, runtimeClasses, runtimeDeletedClassIds, runtimeStudentPatches, runtimeNewStudents, runtimeDeletedStudentIds, runtimeTeachers, runtimeDeletedTeacherIds, runtimeChurches, runtimeDeletedChurchIds
- `getModules()` at line 416 returns raw `MODULES`; `getModuleById()` at line 418 reads raw `MODULES`
- `getCourses()` and `getCourseById()` at lines 420–421 are backward-compat aliases — update them too
- Consumer files that import `getModuleById`: `app/courses/[id]/page.tsx`, `app/teachers/[id]/[classId]/page.tsx`, `app/attend/page.tsx` — do NOT change these files; just make the function runtime-aware

- [ ] **Step 1: Add runtime arrays to the runtime variables block**

Find the last line of the runtime variables block (whichever was added last — likely `runtimeDeletedChurchIds`). Add two new lines immediately after:
```ts
const runtimeModules: Module[] = []
const runtimeDeletedModuleIds = new Set<string>()
```

- [ ] **Step 2: Replace `getModules`, `getAllModules`, `getModuleById`, `getCourses`, `getCourseById` with runtime-aware versions**

Find this block (around line 416):
```ts
export function getModules(): Module[] { return MODULES }
export function getAllModules(): Module[] { return MODULES }
export function getModuleById(id: string): Module | undefined { return MODULES.find(m => m.id === id) }
// backward compat aliases
export function getCourses(): Module[] { return MODULES }
export function getCourseById(id: string): Module | undefined { return MODULES.find(m => m.id === id) }
```

Replace with:
```ts
export function getModules(): Module[] {
  const base = MODULES.filter(m => !runtimeDeletedModuleIds.has(m.id))
  return [...base, ...runtimeModules]
}
export function getAllModules(): Module[] { return getModules() }
export function getModuleById(id: string): Module | undefined {
  if (runtimeDeletedModuleIds.has(id)) return undefined
  return runtimeModules.find(m => m.id === id) ?? MODULES.find(m => m.id === id)
}
// backward compat aliases
export function getCourses(): Module[] { return getModules() }
export function getCourseById(id: string): Module | undefined { return getModuleById(id) }
```

- [ ] **Step 3: Add module-level CRUD functions at end of file**

Append to the end of `lib/mock-data.ts`:
```ts
export function addModule(name: string, code: string): Module {
  const m: Module = { id: `mod-${Date.now()}`, name, code, books: [] }
  runtimeModules.push(m)
  return m
}

export function updateModule(id: string, patch: { name?: string; code?: string }): void {
  const inRuntime = runtimeModules.find(m => m.id === id)
  if (inRuntime) {
    if (patch.name !== undefined) inRuntime.name = patch.name
    if (patch.code !== undefined) inRuntime.code = patch.code
    return
  }
  const inBase = MODULES.find(m => m.id === id)
  if (inBase) {
    if (patch.name !== undefined) inBase.name = patch.name
    if (patch.code !== undefined) inBase.code = patch.code
  }
}

export function deleteModule(id: string): void {
  const rtIdx = runtimeModules.findIndex(m => m.id === id)
  if (rtIdx !== -1) { runtimeModules.splice(rtIdx, 1); return }
  runtimeDeletedModuleIds.add(id)
}
```

- [ ] **Step 4: Add book-level CRUD functions**

Append immediately after `deleteModule`:
```ts
export function addBook(moduleId: string, name: string): Book {
  const mod = getModuleById(moduleId)!
  const book: Book = { id: `${moduleId}-b${Date.now()}`, name, chapters: [] }
  mod.books.push(book)
  return book
}

export function updateBook(moduleId: string, bookId: string, patch: { name?: string }): void {
  const mod = getModuleById(moduleId)!
  const book = mod.books.find(b => b.id === bookId)
  if (book && patch.name !== undefined) book.name = patch.name
}

export function deleteBook(moduleId: string, bookId: string): void {
  const mod = getModuleById(moduleId)!
  mod.books = mod.books.filter(b => b.id !== bookId)
}
```

- [ ] **Step 5: Add chapter-level CRUD functions**

Append immediately after `deleteBook`:
```ts
export function addChapter(moduleId: string, bookId: string, name: string): void {
  const mod = getModuleById(moduleId)!
  const book = mod.books.find(b => b.id === bookId)!
  book.chapters.push(name)
}

export function deleteChapter(moduleId: string, bookId: string, index: number): void {
  const mod = getModuleById(moduleId)!
  const book = mod.books.find(b => b.id === bookId)!
  book.chapters.splice(index, 1)
}
```

- [ ] **Step 6: Verify the build passes**

```bash
npm run build
```

Expected: no TypeScript errors. Pay attention to any errors in `app/courses/[id]/page.tsx`, `app/teachers/[id]/[classId]/page.tsx`, or `app/attend/page.tsx` — these import `getModuleById` and must continue working unchanged.

- [ ] **Step 7: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add modules runtime mutation layer with book and chapter CRUD"
```

---

### Task 2: Create `app/admin/modules/page.tsx`

**Files:**
- Create: `app/admin/modules/page.tsx`

**Context:** This is the most complex admin page. It has 3 levels of expansion:
1. **Module row** → click "Books" to expand a book panel beneath the row
2. **Book row** (in the panel) → click "Chapters" to expand a chapter list beneath the book
3. **Chapter list** → chapters displayed as pills with × delete buttons

State:
- `expandedModuleId: string | null` — which module's book panel is open
- `expandedBookId: string | null` — which book's chapter list is open (only one at a time)
- `forceUpdate` counter for re-renders after mutations
- Separate edit state per level (module inline edit, book inline edit)

Design tokens (same as all admin pages):
```ts
const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
const inputStyle = { background: 'rgba(255,255,255,0.04)' }
```

- [ ] **Step 1: Create the file with the full implementation**

Create `app/admin/modules/page.tsx`:
```tsx
'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import {
  getModules,
  addModule, updateModule, deleteModule,
  addBook, updateBook, deleteBook,
  addChapter, deleteChapter,
} from '@/lib/mock-data'

export default function AdminModulesPage() {
  const [, forceUpdate] = useState(0)
  const refresh = useCallback(() => forceUpdate(n => n + 1), [])

  // Module-level state
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')

  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editModuleName, setEditModuleName] = useState('')
  const [editModuleCode, setEditModuleCode] = useState('')

  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  // Book-level state
  const [newBookName, setNewBookName] = useState('')
  const [editingBookId, setEditingBookId] = useState<string | null>(null)
  const [editBookName, setEditBookName] = useState('')
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null)

  // Chapter-level state
  const [newChapterName, setNewChapterName] = useState('')

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }

  function handleCreateModule() {
    if (!newName.trim() || !newCode.trim()) return
    addModule(newName.trim(), newCode.trim())
    setNewName(''); setNewCode(''); setShowCreate(false)
    refresh()
  }

  function startEditModule(id: string, name: string, code: string) {
    setShowCreate(false)
    setEditingModuleId(id); setEditModuleName(name); setEditModuleCode(code)
  }

  function handleSaveModule() {
    if (!editingModuleId || !editModuleName.trim() || !editModuleCode.trim()) return
    updateModule(editingModuleId, { name: editModuleName.trim(), code: editModuleCode.trim() })
    setEditingModuleId(null)
    refresh()
  }

  function handleDeleteModule(id: string) {
    if (!window.confirm('Delete this module? All books and chapters will be removed.')) return
    deleteModule(id)
    if (expandedModuleId === id) setExpandedModuleId(null)
    refresh()
  }

  function toggleModuleExpand(id: string) {
    setExpandedModuleId(v => v === id ? null : id)
    setExpandedBookId(null)
    setNewBookName('')
    setEditingBookId(null)
    setNewChapterName('')
  }

  function handleAddBook(moduleId: string) {
    if (!newBookName.trim()) return
    addBook(moduleId, newBookName.trim())
    setNewBookName('')
    refresh()
  }

  function startEditBook(bookId: string, name: string) {
    setEditingBookId(bookId); setEditBookName(name)
  }

  function handleSaveBook(moduleId: string, bookId: string) {
    if (!editBookName.trim()) return
    updateBook(moduleId, bookId, { name: editBookName.trim() })
    setEditingBookId(null)
    refresh()
  }

  function handleDeleteBook(moduleId: string, bookId: string) {
    if (!window.confirm('Delete this book and all its chapters?')) return
    deleteBook(moduleId, bookId)
    if (expandedBookId === bookId) setExpandedBookId(null)
    refresh()
  }

  function toggleBookExpand(bookId: string) {
    setExpandedBookId(v => v === bookId ? null : bookId)
    setNewChapterName('')
  }

  function handleAddChapter(moduleId: string, bookId: string) {
    if (!newChapterName.trim()) return
    addChapter(moduleId, bookId, newChapterName.trim())
    setNewChapterName('')
    refresh()
  }

  function handleDeleteChapter(moduleId: string, bookId: string, index: number) {
    deleteChapter(moduleId, bookId, index)
    refresh()
  }

  const modules = getModules()

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
                                <button onClick={() => setEditingBookId(null)} className="px-2.5 py-0.5 rounded text-[10px] font-label text-on-surface-variant/60 border border-white/[0.08] transition-colors">
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
                                onClick={() => handleAddChapter(mod.id, book.id)}
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
                                    onClick={() => handleDeleteChapter(mod.id, book.id, idx)}
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
      </div>
    </AdminShell>
  )
}
```

- [ ] **Step 2: Verify the build passes**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Smoke test manually**

Run `npm run dev`, navigate to `/admin/modules`. Verify:
- All 19 seeded modules appear with correct code + name + book count
- Clicking "Books" expands the book panel; another click collapses it
- Adding a book via the "+ Add Book" form appends it to the panel; book count updates
- Clicking "Chapters" on a book shows chapters as pills
- Adding a chapter appends it as a pill
- Clicking × on a chapter pill removes it
- Edit and Delete work at all 3 levels
- `npm run dev` + navigate to `/courses/1` — module detail page still works (getModuleById is runtime-aware)
- Navigate to `/attend` — module dropdown still shows all modules

- [ ] **Step 4: Commit**

```bash
git add app/admin/modules/page.tsx
git commit -m "feat: add admin modules CRUD page with nested book and chapter management"
```
