# Admin: Students CRUD — Design Spec

## Goal

Add full CRUD management for Students in the admin panel at `/admin/students`.

## Context

The existing `runtimeStudentPatches` mechanism handles `classId` changes triggered by class deletion. The Students admin page must extend this into a full mutation layer: add new students, delete existing ones, and edit all fields (name, class, church, gender). The patch mechanism must be preserved for backward compatibility with `deleteClass`.

`getStudents()` already applies patches. It needs to be extended to also incorporate newly added students and filter deleted ones.

## Data Model

```ts
// lib/types.ts (unchanged)
interface Student {
  id: string
  name: string
  classId: string
  churchId: string
  gender: 'male' | 'female'
}
```

## Runtime Mutation Layer (`lib/mock-data.ts`)

Extend the existing student runtime to support add/delete:

```ts
// Already exists — preserve as-is:
const runtimeStudentPatches: Record<string, Partial<Student>> = {}

// Add these two:
const runtimeNewStudents: Student[] = []
const runtimeDeletedStudentIds = new Set<string>()

// Update getStudents() to incorporate both:
export function getStudents(): Student[] {
  const deletedIds = runtimeDeletedStudentIds
  const base = STUDENTS
    .filter(s => !deletedIds.has(s.id))
    .map(s => runtimeStudentPatches[s.id] ? { ...s, ...runtimeStudentPatches[s.id] } : s)
  return [...base, ...runtimeNewStudents.filter(s => !deletedIds.has(s.id))]
}

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
  if (runtimeDeletedStudentIds.has(id)) return  // guard: don't patch deleted students
  const rt = runtimeNewStudents.find(s => s.id === id)
  if (rt) { Object.assign(rt, patch); return }
  runtimeStudentPatches[id] = { ...runtimeStudentPatches[id], ...patch }
}

export function deleteStudent(id: string): void {
  const rtIdx = runtimeNewStudents.findIndex(s => s.id === id)
  if (rtIdx !== -1) { runtimeNewStudents.splice(rtIdx, 1); return }
  runtimeDeletedStudentIds.add(id)
}
```

`getStudentsByClass(classId)` already calls `getStudents()` — no changes needed there.

## UI: `/admin/students/page.tsx`

- **Header**: "Students" title + "+ New Student" button
- **Create form** (toggle): Name input + Class `<select>` + Church `<select>` + Gender `<select>` ('Male'/'Female'), "Create" button (disabled if any field blank)
- **Table columns**: Name | Class | Church | Gender | Actions
- **Display values**: Class name looked up from `getClasses()` (fallback "Unassigned" if `classId === ''` or not found), church name from `getChurches()` (fallback "Unassigned"), gender capitalized
- **Actions per row**: Edit (inline — all cells become inputs/selects), Save / Cancel; Delete (simple `window.confirm`, no guard)
- **Sorting**: Table displays in the order returned by `getStudents()` — no extra sorting needed

## deleteClass Cascade Update

`deleteClass()` in `lib/mock-data.ts` currently loops over `STUDENTS` to unassign students from a deleted class. It must also loop over `runtimeNewStudents`:

```ts
// In deleteClass(), after the existing STUDENTS loop, add:
for (const s of runtimeNewStudents) {
  if (s.classId === id) s.classId = ''
}
```

## Data Dependencies

The create/edit form requires:
- `getClasses()` — for the class dropdown
- `getChurches()` — for the church dropdown

Both are already exported. This page is the first to import `getChurches()` from outside the churches admin page.

## Error Handling

No validation beyond checking all fields non-empty. `classId` and `churchId` may be empty string (unassigned state) — treat `''` as "Unassigned" display in the table.

## Testing

Manual: create student → appears in table with correct class/church/gender. Edit → updates. Delete → gone. Student count on dashboard/class pages updates. Existing class-delete cascade (setting classId to '') still works.
