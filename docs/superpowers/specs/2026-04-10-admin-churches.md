# Admin: Churches CRUD — Design Spec

## Goal

Add full CRUD management for Churches in the admin panel at `/admin/churches`.

## Context

Churches are referenced by Students (`Student.churchId`). Currently `CHURCHES` is a static array with no runtime mutation. `DENOMINATIONS` is also static and will remain so — no CRUD for denominations.

## Data Models

```ts
// lib/types.ts (unchanged)
interface Church {
  id: string
  name: string
  denominationId: string
}

interface Denomination {
  id: string
  name: string
  abbreviation: string
}
```

## Runtime Mutation Layer (`lib/mock-data.ts`)

```ts
const runtimeChurches: Church[] = []
const runtimeDeletedChurchIds = new Set<string>()

export function getChurches(): Church[] {
  const deletedIds = runtimeDeletedChurchIds
  const base = CHURCHES.filter(c => !deletedIds.has(c.id))
  return [...base, ...runtimeChurches]
}

export function getDenominations(): Denomination[] {
  return DENOMINATIONS
}

export function addChurch(name: string, denominationId: string): Church {
  const c: Church = { id: `ch-${Date.now()}`, name, denominationId }
  runtimeChurches.push(c)
  return c
}

export function updateChurch(id: string, patch: Partial<Pick<Church, 'name' | 'denominationId'>>): void {
  const rt = runtimeChurches.find(c => c.id === id)
  if (rt) { Object.assign(rt, patch); return }
  const base = CHURCHES.find(c => c.id === id)
  if (base) Object.assign(base, patch)
}

export function deleteChurch(id: string): void {
  const rtIdx = runtimeChurches.findIndex(c => c.id === id)
  if (rtIdx !== -1) { runtimeChurches.splice(rtIdx, 1); return }
  runtimeDeletedChurchIds.add(id)
}
```

`getChurches()` must also be used by the Students admin page and any other consumer that reads the churches list. Existing code that uses the raw `CHURCHES` array directly should be updated to use `getChurches()`.

**Delete guard:** Count students using this church via `getStudents().filter(s => s.churchId === id).length`. If > 0, `window.confirm`: "This church has N student(s). Delete anyway?" Orphaned `churchId` is acceptable in mock data.

## UI: `/admin/churches/page.tsx`

- **Header**: "Churches" title + "+ New Church" button  
- **Create form** (toggle): Name input + Denomination `<select>` (populated from `getDenominations()`), "Create" button (disabled if name blank or no denomination selected)
- **Table columns**: Name | Denomination | Actions
- **Denomination cell**: Display `denomination.name` (looked up from `getDenominations()`)
- **Actions per row**: Edit (inline — name input + denomination select replace their cells), Save / Cancel; Delete (with guard confirm)

## Admin Sub-Nav Update (`components/layout/AdminShell.tsx`)

Add Churches link — this is the definitive location for this change:

```ts
import { ..., Church } from '@phosphor-icons/react'

const adminLinks = [
  { href: '/admin/classes',   label: 'Classes',   Icon: Users },
  { href: '/admin/teachers',  label: 'Teachers',  Icon: ChalkboardTeacher },
  { href: '/admin/students',  label: 'Students',  Icon: GraduationCap },
  { href: '/admin/modules',   label: 'Modules',   Icon: BookOpen },
  { href: '/admin/churches',  label: 'Churches',  Icon: Church },
]
```

## Error Handling

No validation beyond `name.trim() !== ''` and `denominationId !== ''`. No async.

## Testing

Manual: create → appears in table with correct denomination label and in Students page church dropdown. Edit name/denomination → updates. Delete unassigned church → gone. Delete church with students → confirm shows count.
