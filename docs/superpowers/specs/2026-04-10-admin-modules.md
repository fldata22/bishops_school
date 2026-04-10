# Admin: Modules CRUD — Design Spec

## Goal

Add full CRUD management for Modules (including their Books and Chapters) in the admin panel at `/admin/modules`.

## Context

Modules are the most complex admin entity. Each `Module` contains an array of `Book` objects, each of which contains a `chapters: string[]` array. The UI must support editing this nested structure without a separate page.

Sessions reference `moduleId`, `bookId`, and `chapterIndex`. Deleting a book or chapter that is referenced by existing sessions will leave orphaned references — acceptable for mock data (no cascade needed).

## Data Models

```ts
// lib/types.ts (unchanged)
interface Book {
  id: string
  name: string
  chapters: string[]
}

interface Module {
  id: string
  name: string
  code: string
  books: Book[]
}
```

## Runtime Mutation Layer (`lib/mock-data.ts`)

```ts
const runtimeModules: Module[] = []
const runtimeDeletedModuleIds = new Set<string>()

export function getModules(): Module[] {
  const deletedIds = runtimeDeletedModuleIds
  const base = MODULES.filter(m => !deletedIds.has(m.id))
  return [...base, ...runtimeModules]
}

export function addModule(name: string, code: string): Module {
  const m: Module = { id: `mod-${Date.now()}`, name, code, books: [] }
  runtimeModules.push(m)
  return m
}

export function updateModule(id: string, patch: Partial<Pick<Module, 'name' | 'code'>>): void {
  const rt = runtimeModules.find(m => m.id === id)
  if (rt) { Object.assign(rt, patch); return }
  const base = MODULES.find(m => m.id === id)
  if (base) Object.assign(base, patch)
}

export function deleteModule(id: string): void {
  const rtIdx = runtimeModules.findIndex(m => m.id === id)
  if (rtIdx !== -1) { runtimeModules.splice(rtIdx, 1); return }
  runtimeDeletedModuleIds.add(id)
}

// Book mutations — find the owning module (runtime or base), mutate in-place
export function addBook(moduleId: string, name: string): Book {
  const mod = getModuleById(moduleId)!
  const book: Book = { id: `${moduleId}-b${Date.now()}`, name, chapters: [] }
  mod.books.push(book)
  return book
}

export function updateBook(moduleId: string, bookId: string, patch: Partial<Pick<Book, 'name'>>): void {
  const mod = getModuleById(moduleId)!
  const book = mod.books.find(b => b.id === bookId)
  if (book) Object.assign(book, patch)
}

export function deleteBook(moduleId: string, bookId: string): void {
  const mod = getModuleById(moduleId)!
  mod.books = mod.books.filter(b => b.id !== bookId)
}

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

// Keep exported — already consumed by /courses/[id]/page.tsx, /teachers/[id]/[classId]/page.tsx, /attend/page.tsx
// Replace existing raw implementation with this runtime-aware version
export function getModuleById(id: string): Module | undefined {
  return runtimeModules.find(m => m.id === id) ?? MODULES.find(m => m.id === id)
}
```

Note: `getModules()` already exists (exported). The existing implementation returns `MODULES` directly — replace it with the runtime-aware version above.

## UI: `/app/admin/modules/page.tsx`

This is a client component with three levels of expansion:

### Level 1 — Module list

Table columns: **Code** | **Name** | **Books** (count) | **Actions**

Actions: Edit (inline — code + name inputs), Save / Cancel; Delete (confirm); "Manage Books" toggle (expand/collapse the row's book panel).

### Level 2 — Book panel (expanded under module row)

Rendered as a nested section below the module row when expanded. Shows:
- List of books: each book has its name + chapter count + "Edit" / "Delete" / "Manage Chapters" actions
- "+ Add Book" form: single name input + "Add" button

Book edit is inline: name input replaces the book name label.

### Level 3 — Chapter list (expanded under book row)

Rendered as a nested section below the book row when expanded. Shows:
- Chapters as a list of tags/pills with a delete (×) button on each
- "+ Add Chapter" form: single text input + "Add" button

### State management

Single `expandedModuleId: string | null` and `expandedBookId: string | null` track which panels are open. All mutations call `refresh()` (`forceUpdate` counter pattern).

### Empty states

- No modules: "No modules yet. Add one above."
- Module with no books: "No books yet. Add one below."
- Book with no chapters: "No chapters yet. Add one below."

## Error Handling

- Module name and code must be non-empty to create/save.
- Book name must be non-empty.
- Chapter name must be non-empty.
- All validated client-side with `disabled` on buttons.

## Testing

Manual: add module → appears in table and in Attendance page module dropdown. Add books + chapters → show in module detail page (`/courses/[id]`). Edit module name/code → updates. Delete book → book gone from module. Delete module → gone from table and attendance form.
