# Admin: Teachers CRUD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full CRUD (create, read, update, delete) for Teachers in the admin panel at `/admin/teachers`.

**Architecture:** Add a runtime mutation layer to `lib/mock-data.ts` (matching the existing Classes pattern), then build a client-side CRUD page that mirrors `app/admin/classes/page.tsx` in structure. No backend — all state is in-memory.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind CSS, `@phosphor-icons/react`, in-memory mock data.

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/mock-data.ts` | Modify | Add runtime arrays + 3 CRUD functions; update `getTeachers()` and `getTeacherById()` |
| `app/admin/teachers/page.tsx` | Create | Full CRUD page (table + inline edit + create form) |

---

### Task 1: Add Teachers runtime mutation layer to `lib/mock-data.ts`

**Files:**
- Modify: `lib/mock-data.ts` — around lines 385–387 (runtime variables block) and 412–414 (getTeachers block) and end of file

**Context:** The file currently has `runtimeClasses`, `runtimeDeletedClassIds`, `runtimeStudentPatches` at lines 385–387. `getTeachers()` at line 412 returns raw `TEACHERS`. `getTeacherById()` at line 414 reads raw `TEACHERS`. The CRUD functions for classes (`addClass`, `updateClass`, `deleteClass`) are at the bottom of the file (lines 742–775) — add teacher CRUD functions after them.

- [ ] **Step 1: Add runtime arrays after the existing runtime variables block (after line 387)**

Find this block in `lib/mock-data.ts`:
```ts
const runtimeClasses: Class[] = []
const runtimeDeletedClassIds = new Set<string>()
const runtimeStudentPatches: Record<string, Partial<Student>> = {}
```

Add two new lines immediately after it:
```ts
const runtimeTeachers: Teacher[] = []
const runtimeDeletedTeacherIds = new Set<string>()
```

- [ ] **Step 2: Replace `getTeachers()` and `getTeacherById()` with runtime-aware versions**

Find this block (around line 412):
```ts
export function getTeachers(): Teacher[] { return TEACHERS }
export function getAllTeachers(): Teacher[] { return TEACHERS }
export function getTeacherById(id: string): Teacher | undefined { return TEACHERS.find(t => t.id === id) }
```

Replace with:
```ts
export function getTeachers(): Teacher[] {
  const base = TEACHERS.filter(t => !runtimeDeletedTeacherIds.has(t.id))
  return [...base, ...runtimeTeachers]
}
export function getAllTeachers(): Teacher[] { return getTeachers() }
export function getTeacherById(id: string): Teacher | undefined {
  if (runtimeDeletedTeacherIds.has(id)) return undefined
  return runtimeTeachers.find(t => t.id === id) ?? TEACHERS.find(t => t.id === id)
}
```

- [ ] **Step 3: Add CRUD functions at the end of `lib/mock-data.ts` (after `deleteClass`)**

Append to the end of the file:
```ts
export function addTeacher(name: string): Teacher {
  const t: Teacher = { id: `tch-${Date.now()}`, name }
  runtimeTeachers.push(t)
  return t
}

export function updateTeacher(id: string, patch: { name?: string }): void {
  const inRuntime = runtimeTeachers.find(t => t.id === id)
  if (inRuntime) {
    if (patch.name !== undefined) inRuntime.name = patch.name
    return
  }
  const inBase = TEACHERS.find(t => t.id === id)
  if (inBase && patch.name !== undefined) inBase.name = patch.name
}

export function deleteTeacher(id: string): void {
  const rtIdx = runtimeTeachers.findIndex(t => t.id === id)
  if (rtIdx !== -1) { runtimeTeachers.splice(rtIdx, 1); return }
  runtimeDeletedTeacherIds.add(id)
}
```

- [ ] **Step 4: Verify the build passes**

```bash
npm run build
```

Expected: no TypeScript errors, no build errors.

- [ ] **Step 5: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add teachers runtime mutation layer (add/update/delete)"
```

---

### Task 2: Create `app/admin/teachers/page.tsx`

**Files:**
- Create: `app/admin/teachers/page.tsx`

**Context:** This page is a close mirror of `app/admin/classes/page.tsx`. Key differences: Teachers have only a `name` field (no teacherId foreign key), the table has two columns (Name | Actions), and the delete guard checks if the teacher is assigned to any class. Use `AdminShell` (at `components/layout/AdminShell.tsx`) as the wrapper — it provides the admin sidebar + mobile nav.

The `inputClass` and `inputStyle` pattern from the Classes page:
```ts
const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
const inputStyle = { background: 'rgba(255,255,255,0.04)' }
```

- [ ] **Step 1: Create the file with the full implementation**

Create `app/admin/teachers/page.tsx`:
```tsx
'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { getTeachers, getClasses, addTeacher, updateTeacher, deleteTeacher } from '@/lib/mock-data'
import type { Teacher } from '@/lib/types'

function useTeachers() {
  const [, forceUpdate] = useState(0)
  const refresh = useCallback(() => forceUpdate(n => n + 1), [])
  return { teachers: getTeachers(), refresh }
}

export default function AdminTeachersPage() {
  const { teachers, refresh } = useTeachers()

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }

  function handleCreate() {
    if (!newName.trim()) return
    addTeacher(newName.trim())
    setNewName('')
    setShowCreate(false)
    refresh()
  }

  function startEdit(t: Teacher) {
    setShowCreate(false)
    setEditingId(t.id)
    setEditName(t.name)
  }

  function handleSaveEdit() {
    if (!editingId || !editName.trim()) return
    updateTeacher(editingId, { name: editName.trim() })
    setEditingId(null)
    refresh()
  }

  function handleDelete(id: string) {
    const assignedCount = getClasses().filter(c => c.teacherId === id).length
    const msg = assignedCount > 0
      ? `This teacher is assigned to ${assignedCount} class(es). Delete anyway?`
      : 'Delete this teacher?'
    if (!window.confirm(msg)) return
    deleteTeacher(id)
    refresh()
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

Run `npm run dev`, navigate to `/admin/teachers`. Verify:
- Table shows 4 seeded teachers
- "+ New Teacher" opens create form; submit adds a row
- "Edit" switches a row to edit mode; "Save" updates the name
- "Delete" on an assigned teacher shows the class count in confirm message
- "Delete" on an unassigned (newly created) teacher removes it without the count message

- [ ] **Step 4: Commit**

```bash
git add app/admin/teachers/page.tsx
git commit -m "feat: add admin teachers CRUD page"
```
