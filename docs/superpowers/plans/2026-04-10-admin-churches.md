# Admin: Churches CRUD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full CRUD for Churches in the admin panel at `/admin/churches`, and add the Churches link to the admin sub-nav.

**Architecture:** Add a runtime mutation layer for churches to `lib/mock-data.ts`, build a client-side CRUD page (same glass-table pattern as Classes), and add a "Churches" link to `AdminShell`. `getDenominations()` already exists — no changes needed there.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind CSS, `@phosphor-icons/react`, in-memory mock data.

**Implement after:** Teachers plan (they share `lib/mock-data.ts` — avoid concurrent edits).

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/mock-data.ts` | Modify | Add church runtime arrays; replace `getChurches()`, `getChurchById()`, `getChurchesByDenomination()` with runtime-aware versions; add `addChurch`, `updateChurch`, `deleteChurch` |
| `app/admin/churches/page.tsx` | Create | Full CRUD page |
| `components/layout/AdminShell.tsx` | Modify | Add "Churches" nav link |

---

### Task 1: Add Churches runtime mutation layer to `lib/mock-data.ts`

**Files:**
- Modify: `lib/mock-data.ts`

**Context:**
- Runtime variable block is around lines 385–387 (after Teachers plan adds two more lines, it will be ~389)
- `getChurches()` is currently at line 398: `export function getChurches(): Church[] { return CHURCHES }`
- `getChurchById()` is at line 399, `getChurchesByDenomination()` at line 400
- `getDenominations()` at line 397 — do NOT change it
- Add church CRUD functions at the end of the file, after `deleteTeacher` (which was added by the Teachers plan)

- [ ] **Step 1: Add runtime arrays after the existing runtime variables block**

In the runtime variables block (find `runtimeTeachers` and `runtimeDeletedTeacherIds` that the Teachers plan added), add two new lines immediately after:
```ts
const runtimeChurches: Church[] = []
const runtimeDeletedChurchIds = new Set<string>()
```

- [ ] **Step 2: Replace `getChurches()`, `getChurchById()`, `getChurchesByDenomination()` with runtime-aware versions**

Find this block (around line 398):
```ts
export function getChurches(): Church[] { return CHURCHES }
export function getChurchById(id: string): Church | undefined { return CHURCHES.find(c => c.id === id) }
export function getChurchesByDenomination(denominationId: string): Church[] { return CHURCHES.filter(c => c.denominationId === denominationId) }
```

Replace with:
```ts
export function getChurches(): Church[] {
  const base = CHURCHES.filter(c => !runtimeDeletedChurchIds.has(c.id))
  return [...base, ...runtimeChurches]
}
export function getChurchById(id: string): Church | undefined {
  if (runtimeDeletedChurchIds.has(id)) return undefined
  return runtimeChurches.find(c => c.id === id) ?? CHURCHES.find(c => c.id === id)
}
export function getChurchesByDenomination(denominationId: string): Church[] {
  return getChurches().filter(c => c.denominationId === denominationId)
}
```

- [ ] **Step 3: Add CRUD functions at the end of `lib/mock-data.ts`**

Append after the last existing function:
```ts
export function addChurch(name: string, denominationId: string): Church {
  const c: Church = { id: `ch-${Date.now()}`, name, denominationId }
  runtimeChurches.push(c)
  return c
}

export function updateChurch(id: string, patch: { name?: string; denominationId?: string }): void {
  const inRuntime = runtimeChurches.find(c => c.id === id)
  if (inRuntime) {
    if (patch.name !== undefined) inRuntime.name = patch.name
    if (patch.denominationId !== undefined) inRuntime.denominationId = patch.denominationId
    return
  }
  const inBase = CHURCHES.find(c => c.id === id)
  if (inBase) {
    if (patch.name !== undefined) inBase.name = patch.name
    if (patch.denominationId !== undefined) inBase.denominationId = patch.denominationId
  }
}

export function deleteChurch(id: string): void {
  const rtIdx = runtimeChurches.findIndex(c => c.id === id)
  if (rtIdx !== -1) { runtimeChurches.splice(rtIdx, 1); return }
  runtimeDeletedChurchIds.add(id)
}
```

- [ ] **Step 4: Verify the build passes**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add churches runtime mutation layer (add/update/delete)"
```

---

### Task 2: Create `app/admin/churches/page.tsx`

**Files:**
- Create: `app/admin/churches/page.tsx`

**Context:** Mirrors the Classes page pattern. Churches have a `denominationId` foreign key — the create/edit form uses a `<select>` populated from `getDenominations()`. The table shows denomination name (looked up from the denominations list). `getStudents()` uses `churchId` — deleting a church leaves orphaned `churchId` references in student records, which is acceptable for mock data.

- [ ] **Step 1: Create the file with the full implementation**

Create `app/admin/churches/page.tsx`:
```tsx
'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import {
  getChurches, getDenominations, getStudents,
  addChurch, updateChurch, deleteChurch
} from '@/lib/mock-data'
import type { Church, Denomination } from '@/lib/types'

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
```

- [ ] **Step 2: Verify the build passes**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/churches/page.tsx
git commit -m "feat: add admin churches CRUD page"
```

---

### Task 3: Add "Churches" link to `AdminShell`

**Files:**
- Modify: `components/layout/AdminShell.tsx`

**Context:** `AdminShell` is at `components/layout/AdminShell.tsx`. It has a `const adminLinks` array at line 7. The current 4 entries are Classes, Teachers, Students, Modules. Add Churches as the 5th. The `Church` icon from `@phosphor-icons/react` is available. The active-state logic uses `pathname.startsWith(href)` — the href `/admin/churches` is correctly scoped.

- [ ] **Step 1: Add the Churches import and link**

In `components/layout/AdminShell.tsx`, find the import line:
```ts
import { Users, ChalkboardTeacher, BookOpen, GraduationCap } from '@phosphor-icons/react'
```

Replace with:
```ts
import { Users, ChalkboardTeacher, BookOpen, GraduationCap, Church } from '@phosphor-icons/react'
```

Then find the `adminLinks` array:
```ts
const adminLinks = [
  { href: '/admin/classes',  label: 'Classes',  Icon: Users },
  { href: '/admin/teachers', label: 'Teachers', Icon: ChalkboardTeacher },
  { href: '/admin/students', label: 'Students', Icon: GraduationCap },
  { href: '/admin/modules',  label: 'Modules',  Icon: BookOpen },
]
```

Replace with:
```ts
const adminLinks = [
  { href: '/admin/classes',   label: 'Classes',   Icon: Users },
  { href: '/admin/teachers',  label: 'Teachers',  Icon: ChalkboardTeacher },
  { href: '/admin/students',  label: 'Students',  Icon: GraduationCap },
  { href: '/admin/modules',   label: 'Modules',   Icon: BookOpen },
  { href: '/admin/churches',  label: 'Churches',  Icon: Church },
]
```

- [ ] **Step 2: Verify the build passes**

```bash
npm run build
```

- [ ] **Step 3: Smoke test**

Run `npm run dev`, navigate to `/admin`. Confirm "Churches" appears as the 5th link in the sidebar (desktop) and is reachable via the bottom nav's Admin tab on mobile.

- [ ] **Step 4: Commit**

```bash
git add components/layout/AdminShell.tsx
git commit -m "feat: add churches link to admin sub-nav"
```
