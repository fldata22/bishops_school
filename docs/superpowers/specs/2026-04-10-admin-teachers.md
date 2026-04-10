# Admin: Teachers CRUD — Design Spec

## Goal

Add full CRUD management for Teachers in the admin panel at `/admin/teachers`.

## Context

Teachers are referenced by Classes (`Class.teacherId`). Currently `getTeachers()` returns the raw static `TEACHERS` array with no runtime mutation support. The admin Classes page already consumes `getTeachers()` to populate dropdowns — changes to the teachers runtime layer must not break that.

## Data Model

```ts
// lib/types.ts (unchanged)
interface Teacher {
  id: string
  name: string
}
```

## Runtime Mutation Layer (`lib/mock-data.ts`)

Add alongside the existing classes runtime pattern:

```ts
const runtimeTeachers: Teacher[] = []
const runtimeDeletedTeacherIds = new Set<string>()

export function getTeachers(): Teacher[] {
  const deletedIds = runtimeDeletedTeacherIds
  const base = TEACHERS.filter(t => !deletedIds.has(t.id))
  return [...base, ...runtimeTeachers]
}

export function addTeacher(name: string): Teacher {
  const t: Teacher = { id: `tch-${Date.now()}`, name }
  runtimeTeachers.push(t)
  return t
}

export function updateTeacher(id: string, patch: Partial<Pick<Teacher, 'name'>>): void {
  const rt = runtimeTeachers.find(t => t.id === id)
  if (rt) { Object.assign(rt, patch); return }
  const base = TEACHERS.find(t => t.id === id)
  if (base) Object.assign(base, patch)
}

export function deleteTeacher(id: string): void {
  const rtIdx = runtimeTeachers.findIndex(t => t.id === id)
  if (rtIdx !== -1) { runtimeTeachers.splice(rtIdx, 1); return }
  runtimeDeletedTeacherIds.add(id)
}
```

**Delete guard:** Before deleting, count how many classes use this teacher via `getClasses().filter(c => c.teacherId === id).length`. If > 0, show a `window.confirm` warning: "This teacher is assigned to N class(es). Delete anyway?" If confirmed, delete proceeds — classes retain the stale `teacherId` (orphaned reference, acceptable for mock data).

## UI: `/admin/teachers/page.tsx`

Mirrors `app/admin/classes/page.tsx` exactly in structure:

- **Header**: "Teachers" title + "+ New Teacher" button
- **Create form** (toggle): Single text input for name, "Create" button (disabled if blank)
- **Table columns**: Name | Actions
- **Actions per row**: Edit (inline — input replaces name cell), Save / Cancel; Delete (with guard confirm)
- No forceUpdate hook needed beyond the same `useState(0)` + `useCallback` pattern

## Admin Sub-Nav Update

Add "Churches" entry to `AdminShell` sub-nav (this spec covers Teachers only; the Churches spec covers the nav addition in full).

`components/layout/AdminShell.tsx`:
- Import `Church` icon from `@phosphor-icons/react`
- Add `{ href: '/admin/churches', label: 'Churches', Icon: Church }` to the sub-nav items array

## Error Handling

No validation beyond `name.trim() !== ''`. No async, no server errors.

## Testing

Manual: create → appears in table and in Classes page teacher dropdown. Edit → name updates. Delete unassigned teacher → gone. Delete assigned teacher → confirm dialog shows class count.
