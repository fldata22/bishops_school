# Admin Infrastructure + Classes CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `/admin` section with its own shell, sidebar nav integration, and full Classes CRUD (create, edit, delete) backed by an in-memory mutation layer.

**Architecture:** Mutation layer lives in `lib/mock-data.ts` alongside existing query functions. `AdminShell` mirrors `PrincipalShell` in structure (client component, `usePathname`). The Classes page is a client component that reads from `getClasses()` and writes via `addClass / updateClass / deleteClass`. Placeholder pages for Teachers, Students, Modules complete the route tree.

**Tech Stack:** TypeScript (strict mode), Next.js 14 App Router, Tailwind CSS, Phosphor Icons (`@phosphor-icons/react`)

**Spec:** `docs/superpowers/specs/2026-04-10-admin-infrastructure-and-classes.md`

---

## File Map

| File | Change |
|------|--------|
| `lib/mock-data.ts` | Add runtime arrays + `addClass`, `updateClass`, `deleteClass`; update `getClasses()` |
| `components/layout/Sidebar.tsx` | Add "Admin" nav item (`GearSix`, `/admin`) |
| `components/layout/BottomNav.tsx` | Add "Admin" tab (`GearSix`, `/admin`) |
| `components/layout/AdminShell.tsx` | **Create** — client shell with admin sub-nav sidebar + bottom nav |
| `app/admin/page.tsx` | **Create** — `redirect('/admin/classes')` |
| `app/admin/classes/page.tsx` | **Create** — Classes CRUD client page |
| `app/admin/teachers/page.tsx` | **Create** — placeholder |
| `app/admin/students/page.tsx` | **Create** — placeholder |
| `app/admin/modules/page.tsx` | **Create** — placeholder |

---

## Task 1: Add mutation layer to `lib/mock-data.ts`

**Files:**
- Modify: `lib/mock-data.ts`

- [ ] **Step 1: Add runtime arrays and `runtimeStudentPatches` after the existing `runtimeSessions`/`runtimeAttendance` declarations**

Find the existing runtime arrays (near the top of the file, after all `const` data arrays). Add below them:

```ts
const runtimeClasses: Class[] = []
const runtimeDeletedClassIds = new Set<string>()
const runtimeStudentPatches: Record<string, Partial<Student>> = {}
```

- [ ] **Step 2: Update `getClasses()` to merge runtime data**

Find the existing `getClasses` function. Replace it with:

```ts
export function getClasses(): Class[] {
  const base = CLASSES.filter(c => !runtimeDeletedClassIds.has(c.id))
  return [...base, ...runtimeClasses]
}
```

- [ ] **Step 3: Update `getStudents()` to apply student patches**

Find the existing `getStudents` function. Replace it with:

```ts
export function getStudents(): Student[] {
  return STUDENTS.map(s => ({ ...s, ...runtimeStudentPatches[s.id] }))
}
```

Also update `getStudentsByClass` if it exists to use the same patch logic:

```ts
export function getStudentsByClass(classId: string): Student[] {
  return getStudents().filter(s => s.classId === classId)
}
```

- [ ] **Step 4: Add `addClass`, `updateClass`, `deleteClass` mutation functions**

Add these three functions after the existing mutation functions (near `submitSession`):

```ts
export function addClass(name: string, teacherId: string): Class {
  const cls: Class = { id: `cls-${Date.now()}`, name, teacherId }
  runtimeClasses.push(cls)
  return cls
}

export function updateClass(id: string, patch: { name?: string; teacherId?: string }): void {
  const inRuntime = runtimeClasses.find(c => c.id === id)
  if (inRuntime) {
    if (patch.name !== undefined) inRuntime.name = patch.name
    if (patch.teacherId !== undefined) inRuntime.teacherId = patch.teacherId
    return
  }
  const inBase = CLASSES.find(c => c.id === id)
  if (inBase) {
    if (patch.name !== undefined) inBase.name = patch.name
    if (patch.teacherId !== undefined) inBase.teacherId = patch.teacherId
  }
}

export function deleteClass(id: string): void {
  const runtimeIdx = runtimeClasses.findIndex(c => c.id === id)
  if (runtimeIdx !== -1) {
    runtimeClasses.splice(runtimeIdx, 1)
  } else {
    runtimeDeletedClassIds.add(id)
  }
  // Unassign all students whose effective classId matches this class
  for (const s of STUDENTS) {
    if ((runtimeStudentPatches[s.id]?.classId ?? s.classId) === id) {
      runtimeStudentPatches[s.id] = { ...runtimeStudentPatches[s.id], classId: '' }
    }
  }
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "mock-data\|types" | head -20
```

Expected: No errors referencing `lib/mock-data.ts` or mutation functions.

- [ ] **Step 6: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add class mutation layer (addClass, updateClass, deleteClass)"
```

---

## Task 2: Add "Admin" to Sidebar and BottomNav

**Files:**
- Modify: `components/layout/Sidebar.tsx`
- Modify: `components/layout/BottomNav.tsx`

- [ ] **Step 1: Update `Sidebar.tsx` — add GearSix import and Admin nav item**

In `Sidebar.tsx`, update the import to add `GearSix`:

```ts
import {
  SquaresFour, CalendarCheck, BookOpen, Users, ChalkboardTeacher, GearSix
} from '@phosphor-icons/react'
```

Add the Admin item to the `navItems` array:

```ts
const navItems = [
  { href: '/dashboard',     label: 'Dashboard',  Icon: SquaresFour },
  { href: '/attendance',    label: 'Attendance', Icon: CalendarCheck },
  { href: '/courses',       label: 'Modules',    Icon: BookOpen },
  { href: '/students',      label: 'Students',   Icon: Users },
  { href: '/teachers',      label: 'Teachers',   Icon: ChalkboardTeacher },
  { href: '/admin', label: 'Admin', Icon: GearSix },
]
```

Using `/admin` as the href means `currentPath.startsWith('/admin')` matches all sub-pages (`/admin/classes`, `/admin/teachers`, etc.), keeping Admin highlighted across the entire admin section. The `/admin/page.tsx` redirect handles navigation to `/admin/classes`.

- [ ] **Step 2: Update `BottomNav.tsx` — add GearSix import and Admin tab**

In `BottomNav.tsx`, update the import to add `GearSix`:

```ts
import { House, CalendarCheck, BookOpen, Users, ChalkboardTeacher, GearSix } from '@phosphor-icons/react'
```

Add the Admin tab to the `tabs` array:

```ts
const tabs = [
  { href: '/dashboard',     label: 'Dashboard',  Icon: House },
  { href: '/attendance',    label: 'Attendance', Icon: CalendarCheck },
  { href: '/courses',       label: 'Modules',    Icon: BookOpen },
  { href: '/students',      label: 'Students',   Icon: Users },
  { href: '/teachers',      label: 'Teachers',   Icon: ChalkboardTeacher },
  { href: '/admin', label: 'Admin', Icon: GearSix },
]
```

- [ ] **Step 3: Verify and commit**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "Sidebar\|BottomNav" | head -10
```

Expected: No errors.

```bash
git add components/layout/Sidebar.tsx components/layout/BottomNav.tsx
git commit -m "feat: add Admin nav item to sidebar and bottom nav"
```

---

## Task 3: Create `AdminShell` component

**Files:**
- Create: `components/layout/AdminShell.tsx`

The shell mirrors `PrincipalShell` in structure — desktop sidebar + top header + mobile bottom nav — but the sidebar shows an admin-specific sub-nav instead of the global nav.

- [ ] **Step 1: Create `components/layout/AdminShell.tsx`**

```tsx
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Users, ChalkboardTeacher, BookOpen, GraduationCap } from '@phosphor-icons/react'
import BottomNav from './BottomNav'

const adminLinks = [
  { href: '/admin/classes',  label: 'Classes',  Icon: Users },
  { href: '/admin/teachers', label: 'Teachers', Icon: ChalkboardTeacher },
  { href: '/admin/students', label: 'Students', Icon: GraduationCap },
  { href: '/admin/modules',  label: 'Modules',  Icon: BookOpen },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-[100dvh]">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 h-full w-64 flex-col py-8 px-4 gap-y-1 z-40 border-r border-white/[0.06]"
        style={{
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="px-4 pt-2 pb-4">
          <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label">Admin</p>
        </div>
        <nav className="flex-1 space-y-0.5">
          {adminLinks.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 border
                  ${active
                    ? 'bg-primary/[0.18] border-primary/[0.28] text-primary-dim'
                    : 'border-transparent text-on-surface-variant/45 hover:text-on-surface/70 hover:bg-surface/[0.04]'
                  }`}
              >
                <Icon size={18} weight={active ? 'fill' : 'regular'} />
                <span className="font-label font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Top header — desktop */}
      <header
        className="hidden md:flex fixed top-0 right-0 left-64 h-16 z-50 items-center px-8 border-b border-white/[0.06]"
        style={{
          background: 'rgba(7,7,15,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <p className="text-sm font-label font-semibold text-on-surface-variant/60 uppercase tracking-wider">Admin</p>
      </header>

      {/* Main content */}
      <main className="md:ml-64 md:pt-16 pb-20 md:pb-12 min-h-[100dvh]">
        {children}
      </main>

      {/* Mobile bottom nav — reuse global nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "AdminShell" | head -10
```

Expected: No errors (file not imported yet, so may not appear in output — that's fine).

- [ ] **Step 3: Commit**

```bash
git add components/layout/AdminShell.tsx
git commit -m "feat: add AdminShell layout component"
```

---

## Task 4: Create `/admin` redirect and placeholder routes

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/teachers/page.tsx`
- Create: `app/admin/students/page.tsx`
- Create: `app/admin/modules/page.tsx`

- [ ] **Step 1: Create `app/admin/page.tsx`**

```tsx
import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/classes')
}
```

- [ ] **Step 2: Create `app/admin/teachers/page.tsx`**

```tsx
import AdminShell from '@/components/layout/AdminShell'

export default function AdminTeachersPage() {
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="text-2xl font-headline font-bold text-on-surface">Teachers</h1>
        <p className="text-on-surface-variant/60 mt-2 font-label">Coming soon</p>
      </div>
    </AdminShell>
  )
}
```

- [ ] **Step 3: Create `app/admin/students/page.tsx`**

```tsx
import AdminShell from '@/components/layout/AdminShell'

export default function AdminStudentsPage() {
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="text-2xl font-headline font-bold text-on-surface">Students</h1>
        <p className="text-on-surface-variant/60 mt-2 font-label">Coming soon</p>
      </div>
    </AdminShell>
  )
}
```

- [ ] **Step 4: Create `app/admin/modules/page.tsx`**

```tsx
import AdminShell from '@/components/layout/AdminShell'

export default function AdminModulesPage() {
  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="text-2xl font-headline font-bold text-on-surface">Modules</h1>
        <p className="text-on-surface-variant/60 mt-2 font-label">Coming soon</p>
      </div>
    </AdminShell>
  )
}
```

- [ ] **Step 5: Verify and commit**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "admin" | head -20
```

Expected: No errors in admin routes.

```bash
git add app/admin/page.tsx app/admin/teachers/page.tsx app/admin/students/page.tsx app/admin/modules/page.tsx
git commit -m "feat: add /admin redirect and placeholder admin routes"
```

---

## Task 5: Create `/admin/classes` CRUD page

**Files:**
- Create: `app/admin/classes/page.tsx`

This is a client component. It reads from `getClasses()` and `getTeachers()`, then drives local state for the table. Mutations call `addClass`, `updateClass`, `deleteClass` and re-derive the list from the updated `getClasses()` call.

- [ ] **Step 1: Create `app/admin/classes/page.tsx`**

```tsx
'use client'
import { useState, useCallback } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import {
  getClasses, getTeachers, getStudentsByClass,
  addClass, updateClass, deleteClass
} from '@/lib/mock-data'
import type { Class, Teacher } from '@/lib/types'

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
```

- [ ] **Step 2: Verify and commit**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | head -40
```

Expected: `✓ Compiled successfully`.

```bash
git add app/admin/classes/page.tsx
git commit -m "feat: add /admin/classes CRUD page"
```

---

## Final Verification

- [ ] Run `npm run dev` and manually verify:
  - Sidebar and BottomNav show "Admin" item linking to `/admin/classes`
  - `/admin` redirects to `/admin/classes`
  - `/admin/classes` renders the classes table with Makarios + Poimen
  - "New Class" button shows the create form; submitting adds a row
  - "Edit" toggles inline edit; Save updates the row; Cancel restores
  - "Delete" removes the class; teachers page for a deleted class's students shows them as unassigned
  - `/admin/teachers`, `/admin/students`, `/admin/modules` render placeholder pages with "Coming soon"
  - Admin sub-nav highlights the active page
  - On mobile, BottomNav "Admin" tab is active when on `/admin/*` routes
