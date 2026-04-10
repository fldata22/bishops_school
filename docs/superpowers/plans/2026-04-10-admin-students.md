# Admin: Students CRUD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full CRUD for Students in the admin panel at `/admin/students`.

**Architecture:** Extend the existing student runtime layer in `lib/mock-data.ts` (which already has `runtimeStudentPatches` for class-deletion cascades) to support adding, updating, and deleting students. Also patch `deleteClass()` to cascade to newly added students. The page follows the same glass-table CRUD pattern.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind CSS, `@phosphor-icons/react`, in-memory mock data.

**Implement after:** Churches plan (so `getChurches()` is runtime-aware when the student form's church dropdown is populated).

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/mock-data.ts` | Modify | Add `runtimeNewStudents` + `runtimeDeletedStudentIds`; replace `getStudents()`; add `addStudent`, `updateStudent`, `deleteStudent`; patch `deleteClass` cascade |
| `app/admin/students/page.tsx` | Create | Full CRUD page with class + church + gender dropdowns |

---

### Task 1: Extend Students runtime layer in `lib/mock-data.ts`

**Files:**
- Modify: `lib/mock-data.ts`

**Context:**
- Current runtime block (after Teachers + Churches plans run) looks like:
  ```ts
  const runtimeSessions: Session[] = []
  const runtimeAttendance: Attendance[] = []
  const runtimeClasses: Class[] = []
  const runtimeDeletedClassIds = new Set<string>()
  const runtimeStudentPatches: Record<string, Partial<Student>> = {}
  const runtimeTeachers: Teacher[] = []
  const runtimeDeletedTeacherIds = new Set<string>()
  const runtimeChurches: Church[] = []
  const runtimeDeletedChurchIds = new Set<string>()
  ```
- `getStudents()` is around line 423: `return STUDENTS.map(s => ({ ...s, ...runtimeStudentPatches[s.id] }))`
- `deleteClass()` is near the end of the file — it has a loop over `STUDENTS` to cascade classId unassignment

- [ ] **Step 1: Add two new runtime variables after `runtimeStudentPatches`**

Find:
```ts
const runtimeStudentPatches: Record<string, Partial<Student>> = {}
```

Add two lines immediately after it:
```ts
const runtimeNewStudents: Student[] = []
const runtimeDeletedStudentIds = new Set<string>()
```

- [ ] **Step 2: Replace `getStudents()` with a full three-source version**

Find:
```ts
export function getStudents(): Student[] {
  return STUDENTS.map(s => ({ ...s, ...runtimeStudentPatches[s.id] }))
}
```

Replace with:
```ts
export function getStudents(): Student[] {
  const deletedIds = runtimeDeletedStudentIds
  const base = STUDENTS
    .filter(s => !deletedIds.has(s.id))
    .map(s => runtimeStudentPatches[s.id] ? { ...s, ...runtimeStudentPatches[s.id] } : s)
  const newOnes = runtimeNewStudents.filter(s => !deletedIds.has(s.id))
  return [...base, ...newOnes]
}
```

- [ ] **Step 3: Add three new CRUD functions at the end of the file**

Append after the last existing function:
```ts
export function addStudent(
  name: string,
  classId: string,
  churchId: string,
  gender: 'male' | 'female'
): Student {
  const s: Student = { id: `stu-${Date.now()}`, name, classId, churchId, gender }
  runtimeNewStudents.push(s)
  return s
}

export function updateStudent(id: string, patch: Partial<Omit<Student, 'id'>>): void {
  if (runtimeDeletedStudentIds.has(id)) return
  const inNew = runtimeNewStudents.find(s => s.id === id)
  if (inNew) { Object.assign(inNew, patch); return }
  runtimeStudentPatches[id] = { ...runtimeStudentPatches[id], ...patch }
}

export function deleteStudent(id: string): void {
  const rtIdx = runtimeNewStudents.findIndex(s => s.id === id)
  if (rtIdx !== -1) { runtimeNewStudents.splice(rtIdx, 1); return }
  runtimeDeletedStudentIds.add(id)
}
```

- [ ] **Step 4: Patch `deleteClass()` to also cascade to `runtimeNewStudents`**

Find the `deleteClass` function. It has a loop like this:
```ts
  for (const s of STUDENTS) {
    if ((runtimeStudentPatches[s.id]?.classId ?? s.classId) === id) {
      runtimeStudentPatches[s.id] = { ...runtimeStudentPatches[s.id], classId: '' }
    }
  }
```

Add a second loop immediately after it (before the closing `}`):
```ts
  for (const s of runtimeNewStudents) {
    if (s.classId === id) s.classId = ''
  }
```

- [ ] **Step 5: Verify the build passes**

```bash
npm run build
```

Expected: no TypeScript errors, no lint errors.

- [ ] **Step 6: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add students runtime mutation layer (add/update/delete) and fix deleteClass cascade"
```

---

### Task 2: Create `app/admin/students/page.tsx`

**Files:**
- Create: `app/admin/students/page.tsx`

**Context:**
- Students have 4 fields: name (text), classId (select from `getClasses()`), churchId (select from `getChurches()`), gender (`'male' | 'female'` → select)
- Table shows: Name | Class | Church | Gender | Actions
- Empty classId or churchId displays as "Unassigned" in the table (a student's class may have been deleted)
- `getClasses()` and `getChurches()` are both runtime-aware at this point
- Same `inputClass`/`inputStyle` design tokens as all other admin pages

- [ ] **Step 1: Create the file with the full implementation**

Create `app/admin/students/page.tsx`:
```tsx
'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import {
  getStudents, getClasses, getChurches,
  addStudent, updateStudent, deleteStudent
} from '@/lib/mock-data'
import type { Student } from '@/lib/types'

function useStudents() {
  const [, forceUpdate] = useState(0)
  const refresh = useCallback(() => forceUpdate(n => n + 1), [])
  return {
    students: getStudents(),
    classes: getClasses(),
    churches: getChurches(),
    refresh,
  }
}

export default function AdminStudentsPage() {
  const { students, classes, churches, refresh } = useStudents()

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newClassId, setNewClassId] = useState('')
  const [newChurchId, setNewChurchId] = useState('')
  const [newGender, setNewGender] = useState<'male' | 'female' | ''>('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editClassId, setEditClassId] = useState('')
  const [editChurchId, setEditChurchId] = useState('')
  const [editGender, setEditGender] = useState<'male' | 'female' | ''>('')

  const inputClass = "rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-label"
  const inputStyle = { background: 'rgba(255,255,255,0.04)' }
  const selectClass = inputClass + " cursor-pointer"

  function handleCreate() {
    if (!newName.trim() || !newGender) return
    addStudent(newName.trim(), newClassId, newChurchId, newGender as 'male' | 'female')
    setNewName(''); setNewClassId(''); setNewChurchId(''); setNewGender('')
    setShowCreate(false)
    refresh()
  }

  function startEdit(s: Student) {
    setShowCreate(false)
    setEditingId(s.id)
    setEditName(s.name)
    setEditClassId(s.classId)
    setEditChurchId(s.churchId)
    setEditGender(s.gender)
  }

  function handleSaveEdit() {
    if (!editingId || !editName.trim() || !editGender) return
    updateStudent(editingId, {
      name: editName.trim(),
      classId: editClassId,
      churchId: editChurchId,
      gender: editGender as 'male' | 'female',
    })
    setEditingId(null)
    refresh()
  }

  function handleDelete(id: string) {
    if (!window.confirm('Delete this student?')) return
    deleteStudent(id)
    refresh()
  }

  const className = (id: string) => classes.find(c => c.id === id)?.name ?? 'Unassigned'
  const churchName = (id: string) => churches.find(c => c.id === id)?.name ?? 'Unassigned'

  return (
    <AdminShell>
      <div className="p-6 md:p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Students</h1>
          <button
            onClick={() => { setShowCreate(v => !v); setEditingId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-label font-semibold bg-primary/20 text-primary-dim border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            {showCreate ? 'Cancel' : '+ New Student'}
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
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" className={inputClass} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Class</label>
              <select value={newClassId} onChange={e => setNewClassId(e.target.value)} className={selectClass} style={inputStyle}>
                <option value="">Unassigned</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Church</label>
              <select value={newChurchId} onChange={e => setNewChurchId(e.target.value)} className={selectClass} style={inputStyle}>
                <option value="">Unassigned</option>
                {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Gender</label>
              <select value={newGender} onChange={e => setNewGender(e.target.value as 'male' | 'female' | '')} className={selectClass} style={inputStyle}>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || !newGender}
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
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Class</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Church</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-label text-on-surface-variant/50">Gender</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3">
                    {editingId === s.id ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)} className={inputClass} style={inputStyle} />
                    ) : (
                      <span className="font-medium text-on-surface">{s.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === s.id ? (
                      <select value={editClassId} onChange={e => setEditClassId(e.target.value)} className={selectClass} style={inputStyle}>
                        <option value="">Unassigned</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    ) : (
                      <span className={`font-label ${s.classId ? 'text-on-surface-variant/70' : 'text-on-surface-variant/35 italic'}`}>{className(s.classId)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === s.id ? (
                      <select value={editChurchId} onChange={e => setEditChurchId(e.target.value)} className={selectClass} style={inputStyle}>
                        <option value="">Unassigned</option>
                        {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    ) : (
                      <span className={`font-label ${s.churchId ? 'text-on-surface-variant/70' : 'text-on-surface-variant/35 italic'}`}>{churchName(s.churchId)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === s.id ? (
                      <select value={editGender} onChange={e => setEditGender(e.target.value as 'male' | 'female' | '')} className={selectClass} style={inputStyle}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <span className="text-on-surface-variant/60 font-label capitalize">{s.gender}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {editingId === s.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editName.trim() || !editGender}
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
                            onClick={() => startEdit(s)}
                            className="px-3 py-1 rounded-lg text-xs font-label text-on-surface-variant/60 border border-white/[0.08] hover:bg-surface/[0.04] hover:text-on-surface transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
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
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant/40 font-label">
                    No students yet. Add one above.
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

- [ ] **Step 3: Smoke test manually**

Run `npm run dev`, navigate to `/admin/students`. Verify:
- Table shows all 30 seeded students with correct class/church/gender display
- "Unassigned" displays (italicized, dimmed) for students whose classId has been cleared
- Create form works: new student appears with correct dropdown values
- Edit works: can change all 4 fields
- Delete removes the student from the list

- [ ] **Step 4: Commit**

```bash
git add app/admin/students/page.tsx
git commit -m "feat: add admin students CRUD page"
```
