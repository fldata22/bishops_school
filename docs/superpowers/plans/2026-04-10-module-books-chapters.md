# Module Books & Chapters Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat `Module.topics: string[]` structure with a two-level `Module.books: Book[]` hierarchy where each `Book` has `chapters: string[]`, and update attendance recording (and all display pages) to operate at the Chapter level.

**Architecture:** Change flows top-down: types first, then seed data, then query functions, then pages. No new files are created. Verification is `npm run build` (TypeScript strict, no test suite). Sessions now record `bookId + chapterIndex` instead of `topicIndex`.

**Tech Stack:** TypeScript (strict mode), Next.js 14 App Router, in-memory mock data

**Spec:** `docs/superpowers/specs/2026-04-10-admin-infrastructure-and-classes.md`

---

## File Map

| File | Change |
|------|--------|
| `lib/types.ts` | Add `Book`; update `Module` (books); update `Session` (bookId + chapterIndex) |
| `lib/mock-data.ts` | Restructure all MODULES; update all 16 SESSIONS; rewrite 4 query functions; update `submitSession` |
| `app/attend/page.tsx` | Add Book + Chapter selectors |
| `app/attendance/page.tsx` | Replace `module.topics.length` with `module.books.length` (2 occurrences) |
| `app/courses/[id]/page.tsx` | Replace topic progress section with book/chapter view |
| `app/courses/CourseDirectoryClient.tsx` | Replace `c.topics.length` with `c.books.length` |
| `app/teachers/[id]/[classId]/page.tsx` | Derive book + chapter name from `session.bookId + session.chapterIndex` |
| `app/students/[id]/page.tsx` | Replace `mod.topics.length` with `mod.books.length` |

---

## Task 1: Update types

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Add `Book` interface and update `Module` and `Session`**

In `lib/types.ts`, add the `Book` interface and update `Module` and `Session`:

```ts
export interface Book {
  id: string
  name: string
  chapters: string[]
}

export interface Module {
  id: string
  name: string
  code: string
  books: Book[]         // replaces: topics: string[]
}

export interface Session {
  id: string
  classId: string
  moduleId: string
  teacherId: string
  date: string
  bookId: string        // replaces: topicIndex: number
  chapterIndex: number
}
```

Remove the old `topics: string[]` from `Module` and `topicIndex: number` from `Session`.

- [ ] **Step 2: Verify TypeScript cascade**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | head -80
```

Expected: Many errors in `lib/mock-data.ts` and page files. This confirms all call sites are known. Do NOT fix yet.

---

## Task 2: Restructure module seed data

**Files:**
- Modify: `lib/mock-data.ts`

The current `topics: string[]` on each module becomes `books: Book[]`. Each string topic becomes a Book with 3 default chapters. Book IDs use the format `${moduleId}-b${n}`.

Only modules m1–m4 have sessions in the seed data; give them proper book IDs. The remaining modules (m5–m19) follow the same pattern.

- [ ] **Step 1: Replace the entire `MODULES` array**

Replace the `MODULES` constant (lines 75–223) with:

```ts
export const MODULES: Module[] = [
  {
    id: 'm1', name: 'Loyalty', code: 'L',
    books: [
      { id: 'm1-b1',  name: 'Loyalty And Disloyalty',          chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b2',  name: 'Those Who Accuse You',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b3',  name: 'Those Who Are Proud',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b4',  name: 'Those Who Are Dangerous Sons',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b5',  name: 'Those Who Are Ignorant',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b6',  name: 'Those Who Forget',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b7',  name: 'Those Who Leave You',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b8',  name: 'Those Who Pretend',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b9',  name: 'One of You Is a Devil',            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b10', name: 'Those Who Honour You',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b11', name: 'Those Who Are Offended',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b12', name: 'Judas Who Is He?',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b13', name: 'Those Who Are Mad',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b14', name: 'Why Loyalty',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b15', name: 'Pillars Of Loyalty',               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b16', name: 'Those Who Are Wolves',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b17', name: 'Those Who Are Slanderers',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b18', name: 'Those Who Rebel',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b19', name: 'Those Who Make Shipwreck',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b20', name: 'Be Faithful unto Death',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm2', name: 'The Call of God', code: 'COG',
    books: [
      { id: 'm2-b1',  name: 'Many Are Called',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b2',  name: 'Why Few Are Chosen',                        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b3',  name: 'Attempt Great Things for God',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b4',  name: 'Tasters Or Partakers',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b5',  name: "Can't You Do Just a Little Bit More",       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b6',  name: 'Weeping and Gnashing',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b7',  name: 'Ready @20',                                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b8',  name: 'Am I Good for Nothing',                     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b9',  name: 'Fruitfulness',                              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b10', name: 'Preparation of the Gospel',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b11', name: 'The Privilege',                             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b12', name: 'Going Deeper and Doing More',               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b13', name: 'Ministerial Barrenness',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b14', name: 'Predestination',                            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b15', name: 'Awake O Sleeper',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b16', name: 'The Word of My Patience',                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm3', name: 'The Work of Ministry', code: 'WOM',
    books: [
      { id: 'm3-b1',  name: 'How You Can Make Full Proof of Your Ministry', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b2',  name: 'Rules of Full Time Ministry',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b3',  name: 'Rules of Church Work',                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b4',  name: 'Losing Suffering Sacrificing and Dying',       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b5',  name: 'It Is a Great Thing to Serve the Lord',        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b6',  name: 'The Tree and Your Ministry',                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b7',  name: 'Not a Novice',                                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b8',  name: 'Seeing And Hearing',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b9',  name: 'If You Love the Lord',                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b10', name: 'Bema Judgment and Justice',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b11', name: 'Stir It Up',                                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b12', name: 'Ministerial Ethics',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b13', name: 'The Big Secret ...Your Ministry Depends on Books', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b14', name: 'The Tests of the Righteous',                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm4', name: 'Church Growth', code: 'CG',
    books: [
      { id: 'm4-b1', name: 'Church Growth',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b2', name: 'Mega Church',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b3', name: 'Church Planting',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b4', name: 'Double Mega Missionary Church',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b5', name: '1000 Micro Churches',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b6', name: 'The Church Must Send',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b7', name: 'Why Is This Church Not Working?',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b8', name: 'The Gift Of Governments',          chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b9', name: 'Church Administration',            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm5', name: 'The Anointing', code: 'A',
    books: [
      { id: 'm5-b1', name: 'Catch the Anointing',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b2', name: 'Steps to the Anointing',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b3', name: 'Amplify Your Ministry',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b4', name: 'Sweet Influences of the Anointing',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b5', name: 'The Anointing and the Presence',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b6', name: 'The Anointed and the Anointing',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b7', name: "Steps to God's Presence",                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b8', name: 'Flow in the Anointing',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b9', name: 'The Love of the Spirit',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm6', name: 'Evangelism', code: 'E',
    books: [
      { id: 'm6-b1', name: 'How You Can Preach Salvation',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b2', name: 'Anagkazo',                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b3', name: 'Others',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b4', name: 'Tell Them',                        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b5', name: 'Make Yourselves Saviours of Men',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b6', name: 'People Who Went to Hell',          chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b7', name: 'Blood Power',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm7', name: 'Pastoral Ministry', code: 'PM',
    books: [
      { id: 'm7-b1', name: 'Transform Your Pastoral Ministry',       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b2', name: 'What It Means to Become a Shepherd',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b3', name: 'The Art of Shepherding',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b4', name: 'Lord, I Know You Need Somebody',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b5', name: 'Top Ten Mistakes that Pastors Make',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b6', name: 'Laikos',                                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm8', name: 'Prayer', code: 'Pr',
    books: [
      { id: 'm8-b1', name: '100% Answered Prayer',                               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b2', name: 'Prayer Changes Things',                               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b3', name: 'How to Pray',                                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b4', name: 'Everything by Prayer Nothing Without Prayer',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b5', name: 'Flow Prayer Book',                                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b6', name: 'Prayer Opportunities',                                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm9', name: 'Leadership', code: 'Le',
    books: [
      { id: 'm9-b1', name: 'The Art of Leadership',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm9-b2', name: 'Wise as Serpents',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm9-b3', name: 'Wisdom is the Principal Thing',   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm9-b4', name: 'The Determinants',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm10', name: 'The Arts', code: 'TA',
    books: [
      { id: 'm10-b1', name: 'The Art of Following',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm10-b2', name: 'The Art of Leadership',   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm10-b3', name: 'The Art of Shepherding',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm10-b4', name: 'The Art of Hearing',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm11', name: 'The Secrets', code: 'TS',
    books: [
      { id: 'm11-b1', name: 'Faith Secrets',        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm11-b2', name: 'Hope Secrets',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm11-b3', name: 'Victory Secrets',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm11-b4', name: 'Enlargement Secrets',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm12', name: 'Finances', code: 'Fi',
    books: [
      { id: 'm12-b1', name: 'He that Hath',                              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm12-b2', name: 'Why Non-tithing Christians Become Poor',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm12-b3', name: 'Labour to be Blessed',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm12-b4', name: 'Neutralize the Curse',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm13', name: 'Marriage', code: 'Ma',
    books: [
      { id: 'm13-b1', name: 'Model Marriage',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm13-b2', name: 'The Beauty, the Beast and the Pastor', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm13-b3', name: 'Jezebel, a Woman out of Order',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm13-b4', name: 'Ppikos Maso',                       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm14', name: 'War', code: 'War',
    books: [
      { id: 'm14-b1', name: 'A Good General',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm14-b2', name: 'Now We Are at War', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm15', name: 'Demonology', code: 'D',
    books: [
      { id: 'm15-b1', name: 'Demons and How to Deal with Them', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm15-b2', name: 'Know Your Invisible Enemies',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm16', name: 'Strong Christian', code: 'SC',
    books: [
      { id: 'm16-b1',  name: 'How to be Born Again and Avoid Hell',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b2',  name: 'How You Can be a Strong Christian',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b3',  name: 'Seven Great Principles',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b4',  name: 'Read Your Bible',                                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b5',  name: 'Spiritual Dangers',                                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b6',  name: 'How Can I Say Thanks',                             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b7',  name: 'Daughter, You Can Make It',                        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b8',  name: 'Backsliding',                                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b9',  name: 'Forgiveness Made Easy',                            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b10', name: 'How You Can Have an Effective Quiet Time',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b11', name: 'Name it! Claim it! Take It!',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b12', name: 'Who is He that Overcometh the World?',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm17', name: 'Church History', code: 'CH',
    books: [
      { id: 'm17-b1', name: 'History of Lighthouse Chapel Vol. 1', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm17-b2', name: 'History of Lighthouse Chapel Vol. 2', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm17-b3', name: 'History of Lighthouse Chapel Vol. 3', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm18', name: 'Gift of Governance', code: 'GoG',
    books: Array.from({ length: 60 }, (_, i) => ({
      id: `m18-b${i + 1}`,
      name: `Chapter ${i + 1}`,
      chapters: ['Part 1', 'Part 2', 'Part 3'],
    })),
  },
  {
    id: 'm19', name: 'Bible Technology', code: 'BT',
    books: [
      { id: 'm19-b1', name: 'Bible Technology Materials', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
]
```

- [ ] **Step 2: Verify no TypeScript errors in module data**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "MODULES\|Book\|topics" | head -20
```

Expected: No errors referencing `MODULES` or `topics` on Module.

---

## Task 3: Update session seed data

**Files:**
- Modify: `lib/mock-data.ts`

Sessions must replace `topicIndex` with `bookId` (matching a book in the module) and `chapterIndex` (0-based index into that book's `chapters` array).

Mapping from old `topicIndex` to new `bookId`:
- m1 topicIndex 0 → `'m1-b1'`, topicIndex 1 → `'m1-b2'`, topicIndex 2 → `'m1-b3'`
- m2 topicIndex 0 → `'m2-b1'`, topicIndex 1 → `'m2-b2'`, topicIndex 2 → `'m2-b3'`
- m3 topicIndex 0 → `'m3-b1'`, topicIndex 1 → `'m3-b2'`
- m4 topicIndex 0 → `'m4-b1'`

- [ ] **Step 1: Replace the `SESSIONS` array**

```ts
export const SESSIONS: Session[] = [
  // Makarios class (cls1) — all sessions taught by t1
  { id: 'ses1',  classId: 'cls1', moduleId: 'm1', teacherId: 't1', date: daysAgo(28), bookId: 'm1-b1', chapterIndex: 0 },
  { id: 'ses2',  classId: 'cls1', moduleId: 'm1', teacherId: 't1', date: daysAgo(21), bookId: 'm1-b2', chapterIndex: 0 },
  { id: 'ses3',  classId: 'cls1', moduleId: 'm2', teacherId: 't1', date: daysAgo(20), bookId: 'm2-b1', chapterIndex: 0 },
  { id: 'ses4',  classId: 'cls1', moduleId: 'm2', teacherId: 't1', date: daysAgo(14), bookId: 'm2-b2', chapterIndex: 0 },
  { id: 'ses5',  classId: 'cls1', moduleId: 'm3', teacherId: 't1', date: daysAgo(13), bookId: 'm3-b1', chapterIndex: 0 },
  { id: 'ses6',  classId: 'cls1', moduleId: 'm1', teacherId: 't1', date: daysAgo(7),  bookId: 'm1-b3', chapterIndex: 0 },
  { id: 'ses7',  classId: 'cls1', moduleId: 'm2', teacherId: 't1', date: daysAgo(3),  bookId: 'm2-b3', chapterIndex: 0 },
  { id: 'ses8',  classId: 'cls1', moduleId: 'm3', teacherId: 't1', date: today,        bookId: 'm3-b2', chapterIndex: 0 },
  // Poimen class (cls2) — all sessions taught by t2
  { id: 'ses9',  classId: 'cls2', moduleId: 'm1', teacherId: 't2', date: daysAgo(27), bookId: 'm1-b1', chapterIndex: 0 },
  { id: 'ses10', classId: 'cls2', moduleId: 'm2', teacherId: 't2', date: daysAgo(20), bookId: 'm2-b1', chapterIndex: 0 },
  { id: 'ses11', classId: 'cls2', moduleId: 'm1', teacherId: 't2', date: daysAgo(18), bookId: 'm1-b2', chapterIndex: 0 },
  { id: 'ses12', classId: 'cls2', moduleId: 'm3', teacherId: 't2', date: daysAgo(13), bookId: 'm3-b1', chapterIndex: 0 },
  { id: 'ses13', classId: 'cls2', moduleId: 'm2', teacherId: 't2', date: daysAgo(11), bookId: 'm2-b2', chapterIndex: 0 },
  { id: 'ses14', classId: 'cls2', moduleId: 'm1', teacherId: 't2', date: daysAgo(6),  bookId: 'm1-b3', chapterIndex: 0 },
  { id: 'ses15', classId: 'cls2', moduleId: 'm3', teacherId: 't2', date: daysAgo(2),  bookId: 'm3-b2', chapterIndex: 0 },
  { id: 'ses16', classId: 'cls2', moduleId: 'm4', teacherId: 't2', date: today,        bookId: 'm4-b1', chapterIndex: 0 },
]
```

---

## Task 4: Update query functions and `submitSession`

**Files:**
- Modify: `lib/mock-data.ts`

- [ ] **Step 1: Rewrite `getModuleTopicStats()` → `getModuleBookStats()`**

Delete the old `getModuleTopicStats` function and replace with:

```ts
export function getModuleBookStats(moduleId: string): { book: Book; sessions: number; attendanceRate: number; taught: boolean }[] {
  const mod = getModuleById(moduleId)
  if (!mod) return []
  const allSessions = getAllSessions().filter(s => s.moduleId === moduleId)
  return mod.books.map(book => {
    const bookSessions = allSessions.filter(s => s.bookId === book.id)
    if (bookSessions.length === 0) return { book, sessions: 0, attendanceRate: 0, taught: false }
    let present = 0, total = 0
    for (const session of bookSessions) {
      const att = getAttendanceForSession(session.id)
      present += att.filter(a => a.status === 'present').length
      total += att.length
    }
    return { book, sessions: bookSessions.length, attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0, taught: true }
  })
}
```

- [ ] **Step 2: Rewrite `getModuleCompletionRate()`**

Replace the existing function:

```ts
export function getModuleCompletionRate(moduleId: string): number {
  const mod = MODULES.find(m => m.id === moduleId)
  if (!mod || mod.books.length === 0) return 0
  const sessions = getAllSessions().filter(s => s.moduleId === moduleId)
  const taughtBookIds = new Set(sessions.map(s => s.bookId))
  return Math.round((taughtBookIds.size / mod.books.length) * 100)
}
```

- [ ] **Step 3: Rewrite `getRecentAttendanceHistory()`**

Replace the existing function:

```ts
export function getRecentAttendanceHistory(studentId: string, limit = 10): { date: string; moduleName: string; bookName: string; chapterName: string; status: 'present' | 'absent' }[] {
  const student = STUDENTS.find(s => s.id === studentId)
  if (!student) return []
  const sessions = getSessionsByClass(student.classId).sort((a, b) => b.date.localeCompare(a.date))
  const results: { date: string; moduleName: string; bookName: string; chapterName: string; status: 'present' | 'absent' }[] = []
  for (const session of sessions) {
    const record = getAllAttendance().find(a => a.sessionId === session.id && a.studentId === studentId)
    if (record) {
      const mod = MODULES.find(m => m.id === session.moduleId)
      const book = mod?.books.find(b => b.id === session.bookId)
      const chapterName = book?.chapters[session.chapterIndex] ?? `Chapter ${session.chapterIndex + 1}`
      results.push({
        date: session.date,
        moduleName: mod?.name ?? 'Unknown Module',
        bookName: book?.name ?? 'Unknown Book',
        chapterName,
        status: record.status,
      })
    }
    if (results.length >= limit) break
  }
  return results
}
```

- [ ] **Step 4: Update `submitSession()`**

Replace the `topicIndex` parameter with `bookId` + `chapterIndex`:

```ts
export function submitSession(params: {
  classId: string
  moduleId: string
  teacherId: string
  date: string
  bookId: string
  chapterIndex: number
  records: { studentId: string; status: 'present' | 'absent'; participationLevel?: 1 | 2 | 3 | 4 }[]
}): { success: boolean; error?: string } {
  const existing = getAllSessions().find(
    s => s.classId === params.classId && s.date === params.date &&
         s.moduleId === params.moduleId && s.bookId === params.bookId && s.chapterIndex === params.chapterIndex
  )
  if (existing) return { success: false, error: 'Attendance for this chapter in this class has already been recorded today.' }
  const sessionId = `rt-${Date.now()}`
  runtimeSessions.push({ id: sessionId, classId: params.classId, moduleId: params.moduleId, teacherId: params.teacherId, date: params.date, bookId: params.bookId, chapterIndex: params.chapterIndex })
  params.records.forEach((r, i) => {
    runtimeAttendance.push({
      id: `rta-${sessionId}-${i}`,
      sessionId,
      studentId: r.studentId,
      status: r.status,
      ...(r.status === 'present' && r.participationLevel ? { participationLevel: r.participationLevel } : {}),
    })
  })
  return { success: true }
}
```

- [ ] **Step 5: Verify lib/ is clean**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | head -60
```

Expected: No TypeScript errors in `lib/`. Remaining errors will be in page files only.

- [ ] **Step 6: Commit data layer**

```bash
git add lib/types.ts lib/mock-data.ts
git commit -m "feat: restructure modules from topics to books+chapters"
```

---

## Task 5: Update `/attend` page

**Files:**
- Modify: `app/attend/page.tsx`

- [ ] **Step 1: Add `bookId` state and update imports**

Add state variables and update the import of `submitSession`:

```ts
const [bookId, setBookId] = useState('')
const [chapterIndex, setChapterIndex] = useState<number | ''>('')
```

Remove the existing `topicIndex` state and replace with `chapterIndex`. Remove the `moduleTopics` useMemo (topics list) — replace with book and chapter derivation:

```ts
const moduleBooks = useMemo(() => {
  if (!moduleId) return []
  return getModuleById(moduleId)?.books ?? []
}, [moduleId])

const bookChapters = useMemo(() => {
  if (!bookId || moduleBooks.length === 0) return []
  return moduleBooks.find(b => b.id === bookId)?.chapters ?? []
}, [bookId, moduleBooks])
```

- [ ] **Step 2: Update change handlers**

Update `handleClassChange` to also reset `bookId` and `chapterIndex`. Update the module change handler:

```ts
// When module changes:
onChange={e => { setModuleId(e.target.value); setBookId(''); setChapterIndex(''); setError('') }}

// Add book change handler:
function handleBookChange(id: string) {
  setBookId(id)
  setChapterIndex('')
  setError('')
}
```

Also update `handleTeacherChange` to reset `bookId` and `chapterIndex`:

```ts
function handleTeacherChange(id: string) {
  setTeacherId(id)
  setModuleId('')
  setBookId('')
  setChapterIndex('')
  setStatuses({})
  setError('')
  const classes = getClassesForTeacher(id)
  if (classes.length === 1) {
    const cls = classes[0]
    setClassId(cls.id)
    const s = getStudentsByClass(cls.id)
    setStatuses(Object.fromEntries(s.map(st => [st.id, 'present'])))
  } else {
    setClassId('')
  }
}
```

- [ ] **Step 3: Add Book and Chapter dropdowns to the JSX**

After the Module selector `<div>`, add:

```tsx
{/* Book selector */}
<div className="flex flex-col gap-1.5 mb-4">
  <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Book</label>
  <select value={bookId} onChange={e => handleBookChange(e.target.value)}
    disabled={!moduleId} className={selectClass} style={selectStyle}>
    <option value="">Select book…</option>
    {moduleBooks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
  </select>
</div>

{/* Chapter selector */}
<div className="flex flex-col gap-1.5 mb-6">
  <label className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Chapter</label>
  <select value={chapterIndex} onChange={e => { setChapterIndex(e.target.value === '' ? '' : Number(e.target.value)); setError('') }}
    disabled={!bookId || bookChapters.length === 0} className={selectClass} style={selectStyle}>
    <option value="">Select chapter…</option>
    {bookChapters.map((chapter, i) => <option key={i} value={i}>{chapter}</option>)}
  </select>
</div>
```

Remove the old Topic selector `<div>`.

- [ ] **Step 4: Update `handleSubmit` guard and `submitSession` call**

```ts
function handleSubmit() {
  if (!teacherId || !classId || !moduleId || !bookId || chapterIndex === '') return
  const today = new Date().toISOString().split('T')[0]
  const classTeacherId = getClassById(classId)?.teacherId ?? teacherId
  const result = submitSession({
    classId, moduleId, teacherId: classTeacherId, date: today,
    bookId, chapterIndex: chapterIndex as number,
    records: students.map(s => ({ studentId: s.id, status: statuses[s.id] ?? 'present' })),
  })
  if (!result.success) { setError(result.error ?? 'Submission failed.'); return }
  const cls = getClassById(classId)
  setSubmittedClassName(cls?.name ?? '')
  setSubmitted(true)
}
```

Also update the submit button's `disabled` condition:
```tsx
disabled={chapterIndex === '' || !bookId}
```

- [ ] **Step 5: Verify and commit**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "attend" | head -20
```

Expected: No errors in `app/attend/`.

```bash
git add app/attend/page.tsx
git commit -m "feat: update attend flow to use books and chapters"
```

---

## Task 6: Update `/courses/[id]` page

**Files:**
- Modify: `app/courses/[id]/page.tsx`

- [ ] **Step 1: Update import**

Replace `getModuleTopicStats` with `getModuleBookStats`:

```ts
import {
  getModuleById, getStudentsForModule,
  getSessionsByModule, getAttendanceForSession, getTeachersForModule,
  getAttendanceRate, getStudentAvatarUrl, getModuleBookStats
} from '@/lib/mock-data'
```

- [ ] **Step 2: Update the stat derivation**

Replace:
```ts
const topicStats = getModuleTopicStats(params.id)
const taughtCount = topicStats.filter(t => t.taught).length
```
With:
```ts
const bookStats = getModuleBookStats(params.id)
const taughtCount = bookStats.filter(b => b.taught).length
```

- [ ] **Step 3: Update the subtitle text (desktop)**

Replace:
```tsx
{moduleData.topics.length} topics · Code: {moduleData.code}
```
With:
```tsx
{moduleData.books.length} books · Code: {moduleData.code}
```

- [ ] **Step 4: Update the "Topic Progress" section (desktop)**

Replace the desktop topic progress section heading and counter:
```tsx
// Before:
<h3 ...>Topic Progress</h3>
<span ...>{taughtCount}/{topicStats.length} taught</span>
// Iterate: topicStats.map((t, i) => ... t.topic ... t.taught ... t.attendanceRate ...)

// After:
<h3 ...>Book Progress</h3>
<span ...>{taughtCount}/{bookStats.length} taught</span>
// Iterate: bookStats.map((b, i) => ... b.book.name ... b.taught ... b.attendanceRate ...)
```

Update the iteration variable from `t` to `b` and `t.topic` to `b.book.name`, `t.taught` to `b.taught`, `t.attendanceRate` to `b.attendanceRate`, `t.sessions` to `b.sessions`.

- [ ] **Step 5: Update the "Topic Progress" section (mobile)**

Same replacements as Step 4 for the mobile section (lower in the file, same pattern):
- `Topic Progress` → `Book Progress`
- `topicStats` → `bookStats`
- `t.topic` → `b.book.name`
- `t.taught` → `b.taught`
- `t.attendanceRate` → `b.attendanceRate`

- [ ] **Step 6: Verify and commit**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "courses" | head -20
```

Expected: No errors in `app/courses/`.

```bash
git add app/courses/[id]/page.tsx
git commit -m "feat: update course detail page to show books instead of topics"
```

---

## Task 7: Update `/teachers/[id]/[classId]` page

**Files:**
- Modify: `app/teachers/[id]/[classId]/page.tsx`

- [ ] **Step 1: Update session topic derivation**

The session rows currently derive the topic name with:
```ts
const topic = session.topicIndex < mod.topics.length ? mod.topics[session.topicIndex] : `Topic ${session.topicIndex + 1}`
```

Replace with book + chapter derivation:
```ts
const book = mod.books.find(b => b.id === session.bookId)
const chapterName = book?.chapters[session.chapterIndex] ?? `Chapter ${session.chapterIndex + 1}`
const topic = book ? `${book.name} › ${chapterName}` : `Unknown`
```

This requires no import changes — `getModuleById` already returns the new `Module` shape.

- [ ] **Step 2: Verify and commit**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | grep "teachers" | head -20
```

Expected: No errors in `app/teachers/`.

```bash
git add "app/teachers/[id]/[classId]/page.tsx"
git commit -m "feat: update teacher detail to show book and chapter names"
```

---

## Task 8: Update `/students/[id]` page

**Files:**
- Modify: `app/students/[id]/page.tsx`

- [ ] **Step 1: Replace `mod.topics.length`**

Find the line (around line 150 in the desktop module breakdown section):
```tsx
<p className="text-xs text-on-surface-variant/60 font-label">{mod.topics.length} topics · {mod.code}</p>
```

Replace with:
```tsx
<p className="text-xs text-on-surface-variant/60 font-label">{mod.books.length} books · {mod.code}</p>
```

- [ ] **Step 2: Verify build is fully clean**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add app/students/[id]/page.tsx
git commit -m "feat: update student profile to reference books count"
```

---

## Task 9: Fix `CourseDirectoryClient` and `attendance` page

**Files:**
- Modify: `app/courses/CourseDirectoryClient.tsx`
- Modify: `app/attendance/page.tsx`

Both files access `Module.topics` directly. After Task 1 removes `topics` from the `Module` type, these will produce TypeScript errors.

- [ ] **Step 1: Fix `CourseDirectoryClient.tsx`**

Find line 117 (inside the course card):
```tsx
<span>{c.topics.length} topics · {c.code}</span>
```

Replace with:
```tsx
<span>{c.books.length} books · {c.code}</span>
```

- [ ] **Step 2: Fix `app/attendance/page.tsx`**

Find the two occurrences of `module.topics.length` (around lines 217 and 306):
```tsx
{sessions} sessions · {module.topics.length} topics
```

Replace both with:
```tsx
{sessions} sessions · {module.books.length} books
```

- [ ] **Step 3: Verify and commit**

```bash
cd /Users/emmanuel/Documents/course_tracker && npm run build 2>&1 | head -40
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

```bash
git add app/courses/CourseDirectoryClient.tsx app/attendance/page.tsx
git commit -m "feat: update course directory and attendance page to reference books"
```

---

## Final Verification

- [ ] Run `npm run dev` and manually verify:
  - `/attend` — teacher → class → module → book → chapter → students → submit works
  - `/courses` — module list still renders with book counts
  - `/courses/[id]` — "Book Progress" section shows books with attendance bars
  - `/teachers/[id]/[classId]` — session rows show "Book Name › Chapter Name"
  - `/students/[id]` — module breakdown shows "N books · CODE"
