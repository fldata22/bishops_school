# Course Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first PWA with two surfaces: a public teacher attendance submission page (`/attend`) and a full principal dashboard with stats, course directory, student profiles, and reports placeholder.

**Architecture:** Next.js 14 App Router with TypeScript. All data lives in `/lib/mock-data.ts` with isolated query functions swappable for real API calls. Auth is a React context with hardcoded principal credentials. The Nocturne Scholar design system is implemented as a Tailwind theme extension.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v3, Framer Motion, @phosphor-icons/react, Manrope + Inter (Google Fonts), next-pwa

**Visual references:** `~/Downloads/stitch/` — mobile and desktop mockups for every screen

---

## File Map

```
app/
  layout.tsx                        # Root layout: fonts, PWA meta, AuthProvider
  page.tsx                          # Redirect → /login
  login/page.tsx                    # Principal login
  dashboard/page.tsx                # Principal dashboard
  courses/page.tsx                  # Course directory
  courses/[id]/page.tsx             # Course detail
  students/[id]/page.tsx            # Student profile
  reports/page.tsx                  # Coming Soon
  attend/page.tsx                   # Teacher attendance (public)

components/
  layout/
    PrincipalShell.tsx              # Auth guard + mobile bottom tabs + desktop sidebar
    BottomNav.tsx                   # Mobile bottom tab bar
    Sidebar.tsx                     # Desktop left sidebar
  ui/
    ProgressNebula.tsx              # Circular attendance % indicator
    StatusBadge.tsx                 # Present/Absent pill
    StatPill.tsx                    # Stat count pill (dashboard hero row)
    CriticalAlertCard.tsx           # At-risk student alert item
    CourseCard.tsx                  # Course card (directory)
    StudentRow.tsx                  # Student row (course detail + attend page)
  attend/
    StudentToggleList.tsx           # Student list with present/absent toggle
    SuccessScreen.tsx               # Post-submit confirmation
    # Teacher + course dropdowns are inlined in app/attend/page.tsx (no separate component)

lib/
  mock-data.ts                      # All records + all query functions
  types.ts                          # Shared TypeScript types
  auth-context.tsx                  # Role context + useAuth hook

tailwind.config.ts                  # Nocturne Scholar theme tokens
next.config.js                      # next-pwa config
public/
  manifest.json                     # PWA manifest
  icons/                            # PWA icons
```

---

## Task 1: Project Bootstrap

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `next.config.js`, `app/layout.tsx`, `public/manifest.json`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd /Users/emmanuel/Documents/course_tracker
npx create-next-app@14 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion @phosphor-icons/react next-pwa
npm install --save-dev @types/node
```

- [ ] **Step 3: Replace `tailwind.config.ts` with Nocturne Scholar theme**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'background':                '#060e20',
        'surface':                   '#060e20',
        'surface-dim':               '#060e20',
        'surface-container-lowest':  '#000000',
        'surface-container-low':     '#091328',
        'surface-container':         '#0f1930',
        'surface-container-high':    '#141f38',
        'surface-container-highest': '#192540',
        'surface-bright':            '#1f2b49',
        'surface-variant':           '#192540',
        'on-surface':                '#dee5ff',
        'on-surface-variant':        '#a3aac4',
        'on-background':             '#dee5ff',
        'outline':                   '#6d758c',
        'outline-variant':           '#40485d',
        'primary':                   '#a3a6ff',
        'primary-container':         '#9396ff',
        'primary-dim':               '#6063ee',
        'primary-fixed':             '#9396ff',
        'primary-fixed-dim':         '#8387ff',
        'on-primary':                '#0f00a4',
        'on-primary-container':      '#0a0081',
        'inverse-primary':           '#494bd7',
        'surface-tint':              '#a3a6ff',
        'secondary':                 '#69f6b8',
        'secondary-dim':             '#58e7ab',
        'secondary-container':       '#006c49',
        'secondary-fixed':           '#69f6b8',
        'secondary-fixed-dim':       '#58e7ab',
        'on-secondary':              '#005a3c',
        'on-secondary-container':    '#e1ffec',
        'on-secondary-fixed':        '#00452d',
        'on-secondary-fixed-variant':'#006544',
        'tertiary':                  '#ff9dd1',
        'tertiary-dim':              '#eb7bba',
        'tertiary-container':        '#fa88c8',
        'tertiary-fixed':            '#fd8bca',
        'tertiary-fixed-dim':        '#ee7ebc',
        'on-tertiary':               '#6c0f4d',
        'on-tertiary-container':     '#5e0042',
        'on-tertiary-fixed':         '#360024',
        'on-tertiary-fixed-variant': '#6d104e',
        'error':                     '#ff6e84',
        'error-dim':                 '#d73357',
        'error-container':           '#a70138',
        'on-error':                  '#490013',
        'on-error-container':        '#ffb2b9',
        'inverse-surface':           '#faf8ff',
        'inverse-on-surface':        '#4d556b',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        full:    '0.75rem',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        label:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 4: Configure `next.config.js` with next-pwa**

```js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withPWA(nextConfig)
```

- [ ] **Step 5: Create `public/manifest.json`**

```json
{
  "name": "Course Tracker",
  "short_name": "Attendance",
  "description": "Track student attendance across courses",
  "start_url": "/attend",
  "display": "standalone",
  "background_color": "#060e20",
  "theme_color": "#060e20",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 6: Create placeholder PWA icons**

```bash
mkdir -p public/icons
# Create simple placeholder PNGs — replace with real icons before production
curl -o public/icons/icon-192.png "https://via.placeholder.com/192/060e20/a3a6ff?text=CT"
curl -o public/icons/icon-512.png "https://via.placeholder.com/512/060e20/a3a6ff?text=CT"
```

- [ ] **Step 7: Update `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'Course Tracker',
  description: 'Track student attendance',
  manifest: '/manifest.json',
  themeColor: '#060e20',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${inter.variable}`}>
      <body className="bg-background text-on-surface font-body antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 8: Update `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { font-family: var(--font-inter), sans-serif; }
  h1, h2, h3, h4, h5, h6 { font-family: var(--font-manrope), sans-serif; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #060e20; }
  ::-webkit-scrollbar-thumb { background: #40485d; border-radius: 10px; }
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```
Expected: Next.js running at http://localhost:3000 with no errors.

- [ ] **Step 10: Commit**

```bash
git init
git add -A
git commit -m "feat: bootstrap Next.js 14 with Nocturne Scholar theme and PWA config"
```

---

## Task 2: Types and Mock Data

**Files:**
- Create: `lib/types.ts`, `lib/mock-data.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```ts
export interface Principal { id: string; name: string; email: string; password: string }
export interface Teacher   { id: string; name: string }
export interface Course {
  id: string; name: string; teacherId: string; studentIds: string[]
  schedule: { days: ('Mon'|'Tue'|'Wed'|'Thu'|'Fri')[]; time: string; room: string }
}
export interface Student   { id: string; name: string }
export interface Session   { id: string; courseId: string; date: string; submittedBy: string }
export interface Attendance { id: string; sessionId: string; studentId: string; status: 'present'|'absent' }

export interface AttendanceRate { studentId: string; courseId: string; rate: number; present: number; total: number }
export interface CriticalAlert  { studentId: string; studentName: string; courseId: string; courseName: string; rate: number }
export interface WeeklyTrend    { weekLabel: string; rate: number }
```

- [ ] **Step 2: Create `lib/mock-data.ts` — records**

```ts
import type { Principal, Teacher, Course, Student, Session, Attendance,
              AttendanceRate, CriticalAlert, WeeklyTrend } from './types'

// ─── Records ────────────────────────────────────────────────────────────────

export const PRINCIPAL: Principal = {
  id: 'p1', name: 'Dr. Julian Vance', email: 'principal@academy.edu', password: 'nocturne2026'
}

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Elena Vance' },
  { id: 't2', name: 'Prof. Marcus Chen' },
  { id: 't3', name: 'Dr. Sarah Chen' },
  { id: 't4', name: 'Prof. Julian Ward' },
]

export const STUDENTS: Student[] = [
  { id: 's1',  name: 'Amara Okafor' },
  { id: 's2',  name: 'Julian Rivera' },
  { id: 's3',  name: 'Sophie Chen' },
  { id: 's4',  name: 'Marcus Thorne' },
  { id: 's5',  name: 'Elena Petrova' },
  { id: 's6',  name: 'Kai Nakamura' },
  { id: 's7',  name: 'Zara Osei' },
  { id: 's8',  name: 'Luca Ferretti' },
  { id: 's9',  name: 'Nadia Volkov' },
  { id: 's10', name: 'Theo Adeyemi' },
  { id: 's11', name: 'Iris Fontaine' },
  { id: 's12', name: 'Ravi Kapoor' },
  { id: 's13', name: 'Celeste Moreau' },
  { id: 's14', name: 'Dario Ricci' },
  { id: 's15', name: 'Yuna Park' },
  { id: 's16', name: 'Felix Braun' },
]

// today's ISO date — used to ensure "Present Today" is non-zero
const today = new Date().toISOString().split('T')[0]

// dates going back 8 weeks
function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]
}

export const COURSES: Course[] = [
  {
    id: 'c1', name: 'Advanced Data Structures', teacherId: 't1',
    studentIds: ['s1','s2','s3','s4','s5','s6'],
    schedule: { days: ['Mon','Wed','Fri'], time: '09:00', room: 'Room 402' }
  },
  {
    id: 'c2', name: 'Theory of Computation', teacherId: 't1',
    studentIds: ['s7','s8','s9','s10','s11'],
    schedule: { days: ['Tue','Thu'], time: '11:00', room: 'Room 210' }
  },
  {
    id: 'c3', name: 'Cloud Architecture', teacherId: 't2',
    studentIds: ['s1','s3','s5','s12','s13','s14'],
    schedule: { days: ['Mon','Wed'], time: '14:00', room: 'Lab 3' }
  },
  {
    id: 'c4', name: 'UX Research Methods', teacherId: 't3',
    studentIds: ['s2','s4','s6','s15','s16'],
    schedule: { days: ['Tue','Thu'], time: '13:00', room: 'Studio B' }
  },
  {
    id: 'c5', name: 'Computational Statistics', teacherId: 't4',
    studentIds: ['s7','s9','s11','s13','s15'],
    schedule: { days: ['Mon','Wed','Fri'], time: '15:30', room: 'Room 118' }
  },
]

// Sessions: ~16 per course over 8 weeks, plus one for today
export const SESSIONS: Session[] = [
  // Course c1 — 16 sessions + today
  { id: 'ses-c1-01', courseId: 'c1', date: daysAgo(56), submittedBy: 't1' },
  { id: 'ses-c1-02', courseId: 'c1', date: daysAgo(54), submittedBy: 't1' },
  { id: 'ses-c1-03', courseId: 'c1', date: daysAgo(52), submittedBy: 't1' },
  { id: 'ses-c1-04', courseId: 'c1', date: daysAgo(49), submittedBy: 't1' },
  { id: 'ses-c1-05', courseId: 'c1', date: daysAgo(47), submittedBy: 't1' },
  { id: 'ses-c1-06', courseId: 'c1', date: daysAgo(45), submittedBy: 't1' },
  { id: 'ses-c1-07', courseId: 'c1', date: daysAgo(42), submittedBy: 't1' },
  { id: 'ses-c1-08', courseId: 'c1', date: daysAgo(40), submittedBy: 't1' },
  { id: 'ses-c1-09', courseId: 'c1', date: daysAgo(38), submittedBy: 't1' },
  { id: 'ses-c1-10', courseId: 'c1', date: daysAgo(35), submittedBy: 't1' },
  { id: 'ses-c1-11', courseId: 'c1', date: daysAgo(33), submittedBy: 't1' },
  { id: 'ses-c1-12', courseId: 'c1', date: daysAgo(31), submittedBy: 't1' },
  { id: 'ses-c1-13', courseId: 'c1', date: daysAgo(28), submittedBy: 't1' },
  { id: 'ses-c1-14', courseId: 'c1', date: daysAgo(14), submittedBy: 't1' },
  { id: 'ses-c1-15', courseId: 'c1', date: daysAgo(7),  submittedBy: 't1' },
  { id: 'ses-c1-16', courseId: 'c1', date: daysAgo(2),  submittedBy: 't1' },
  { id: 'ses-c1-today', courseId: 'c1', date: today,    submittedBy: 't1' },
  // Course c2
  { id: 'ses-c2-01', courseId: 'c2', date: daysAgo(55), submittedBy: 't1' },
  { id: 'ses-c2-02', courseId: 'c2', date: daysAgo(50), submittedBy: 't1' },
  { id: 'ses-c2-03', courseId: 'c2', date: daysAgo(48), submittedBy: 't1' },
  { id: 'ses-c2-04', courseId: 'c2', date: daysAgo(43), submittedBy: 't1' },
  { id: 'ses-c2-05', courseId: 'c2', date: daysAgo(41), submittedBy: 't1' },
  { id: 'ses-c2-06', courseId: 'c2', date: daysAgo(36), submittedBy: 't1' },
  { id: 'ses-c2-07', courseId: 'c2', date: daysAgo(29), submittedBy: 't1' },
  { id: 'ses-c2-08', courseId: 'c2', date: daysAgo(22), submittedBy: 't1' },
  { id: 'ses-c2-09', courseId: 'c2', date: daysAgo(15), submittedBy: 't1' },
  { id: 'ses-c2-10', courseId: 'c2', date: daysAgo(8),  submittedBy: 't1' },
  { id: 'ses-c2-11', courseId: 'c2', date: daysAgo(1),  submittedBy: 't1' },
  { id: 'ses-c2-today', courseId: 'c2', date: today,    submittedBy: 't1' },
  // Course c3
  { id: 'ses-c3-01', courseId: 'c3', date: daysAgo(56), submittedBy: 't2' },
  { id: 'ses-c3-02', courseId: 'c3', date: daysAgo(51), submittedBy: 't2' },
  { id: 'ses-c3-03', courseId: 'c3', date: daysAgo(49), submittedBy: 't2' },
  { id: 'ses-c3-04', courseId: 'c3', date: daysAgo(44), submittedBy: 't2' },
  { id: 'ses-c3-05', courseId: 'c3', date: daysAgo(42), submittedBy: 't2' },
  { id: 'ses-c3-06', courseId: 'c3', date: daysAgo(37), submittedBy: 't2' },
  { id: 'ses-c3-07', courseId: 'c3', date: daysAgo(30), submittedBy: 't2' },
  { id: 'ses-c3-08', courseId: 'c3', date: daysAgo(23), submittedBy: 't2' },
  { id: 'ses-c3-09', courseId: 'c3', date: daysAgo(9),  submittedBy: 't2' },
  { id: 'ses-c3-today', courseId: 'c3', date: today,    submittedBy: 't2' },
  // Course c4
  { id: 'ses-c4-01', courseId: 'c4', date: daysAgo(55), submittedBy: 't3' },
  { id: 'ses-c4-02', courseId: 'c4', date: daysAgo(48), submittedBy: 't3' },
  { id: 'ses-c4-03', courseId: 'c4', date: daysAgo(41), submittedBy: 't3' },
  { id: 'ses-c4-04', courseId: 'c4', date: daysAgo(34), submittedBy: 't3' },
  { id: 'ses-c4-05', courseId: 'c4', date: daysAgo(27), submittedBy: 't3' },
  { id: 'ses-c4-06', courseId: 'c4', date: daysAgo(20), submittedBy: 't3' },
  { id: 'ses-c4-07', courseId: 'c4', date: daysAgo(13), submittedBy: 't3' },
  { id: 'ses-c4-08', courseId: 'c4', date: daysAgo(6),  submittedBy: 't3' },
  // Course c5
  { id: 'ses-c5-01', courseId: 'c5', date: daysAgo(56), submittedBy: 't4' },
  { id: 'ses-c5-02', courseId: 'c5', date: daysAgo(54), submittedBy: 't4' },
  { id: 'ses-c5-03', courseId: 'c5', date: daysAgo(49), submittedBy: 't4' },
  { id: 'ses-c5-04', courseId: 'c5', date: daysAgo(47), submittedBy: 't4' },
  { id: 'ses-c5-05', courseId: 'c5', date: daysAgo(42), submittedBy: 't4' },
  { id: 'ses-c5-06', courseId: 'c5', date: daysAgo(35), submittedBy: 't4' },
  { id: 'ses-c5-07', courseId: 'c5', date: daysAgo(28), submittedBy: 't4' },
  { id: 'ses-c5-08', courseId: 'c5', date: daysAgo(21), submittedBy: 't4' },
  { id: 'ses-c5-09', courseId: 'c5', date: daysAgo(14), submittedBy: 't4' },
  { id: 'ses-c5-10', courseId: 'c5', date: daysAgo(7),  submittedBy: 't4' },
]

// Attendance records — varied rates to produce realistic at-risk students
// s2 (Julian Rivera) has low attendance in c1 — will trigger at-risk alert
// s9 (Nadia Volkov) has low attendance in c2 and c5
export const ATTENDANCE: Attendance[] = [
  // c1 sessions — s2 misses many
  ...(() => {
    const c1Sessions = SESSIONS.filter(s => s.courseId === 'c1')
    const c1Students = ['s1','s2','s3','s4','s5','s6']
    const records: Attendance[] = []
    c1Sessions.forEach((ses, si) => {
      c1Students.forEach((stdId, stIdx) => {
        // s2 attends only 4 of 17 sessions (~24%) — deterministic
        // others: absent if (si + stIdx) % 9 === 0 (roughly 89% attendance)
        const present = stdId === 's2' ? si < 4 : (si + stIdx) % 9 !== 0
        records.push({ id: `att-${ses.id}-${stdId}`, sessionId: ses.id, studentId: stdId, status: present ? 'present' : 'absent' })
      })
    })
    return records
  })(),
  // c2 sessions — s9 attends ~55%
  ...(() => {
    const c2Sessions = SESSIONS.filter(s => s.courseId === 'c2')
    const c2Students = ['s7','s8','s9','s10','s11']
    const records: Attendance[] = []
    c2Sessions.forEach((ses, si) => {
      c2Students.forEach((stdId, stIdx) => {
        const present = stdId === 's9' ? si % 2 === 0 : (si + stIdx) % 10 !== 0
        records.push({ id: `att-${ses.id}-${stdId}`, sessionId: ses.id, studentId: stdId, status: present ? 'present' : 'absent' })
      })
    })
    return records
  })(),
  // c3 sessions — all good attendance
  ...(() => {
    const sessions = SESSIONS.filter(s => s.courseId === 'c3')
    const students = ['s1','s3','s5','s12','s13','s14']
    const records: Attendance[] = []
    sessions.forEach((ses, si) => {
      students.forEach((stdId, stIdx) => {
        records.push({ id: `att-${ses.id}-${stdId}`, sessionId: ses.id, studentId: stdId, status: (si + stIdx) % 11 !== 0 ? 'present' : 'absent' })
      })
    })
    return records
  })(),
  // c4 sessions
  ...(() => {
    const sessions = SESSIONS.filter(s => s.courseId === 'c4')
    const students = ['s2','s4','s6','s15','s16']
    const records: Attendance[] = []
    sessions.forEach((ses, si) => {
      students.forEach((stdId, stIdx) => {
        records.push({ id: `att-${ses.id}-${stdId}`, sessionId: ses.id, studentId: stdId, status: (si + stIdx) % 9 !== 0 ? 'present' : 'absent' })
      })
    })
    return records
  })(),
  // c5 sessions — s9 also in this course, low attendance
  ...(() => {
    const sessions = SESSIONS.filter(s => s.courseId === 'c5')
    const students = ['s7','s9','s11','s13','s15']
    const records: Attendance[] = []
    sessions.forEach((ses, si) => {
      students.forEach((stdId, stIdx) => {
        const present = stdId === 's9' ? si % 3 === 0 : (si + stIdx) % 10 !== 0
        records.push({ id: `att-${ses.id}-${stdId}`, sessionId: ses.id, studentId: stdId, status: present ? 'present' : 'absent' })
      })
    })
    return records
  })(),
]
```

- [ ] **Step 3: Create `lib/mock-data.ts` — query functions (append to same file)**

```ts
// ─── Query Functions ─────────────────────────────────────────────────────────

export function getTeachers(): Teacher[] { return TEACHERS }
export function getStudents(): Student[] { return STUDENTS }
export function getCourses(): Course[]   { return COURSES }

export function getTeacherById(id: string): Teacher | undefined {
  return TEACHERS.find(t => t.id === id)
}
export function getStudentById(id: string): Student | undefined {
  return STUDENTS.find(s => s.id === id)
}
export function getCourseById(id: string): Course | undefined {
  return COURSES.find(c => c.id === id)
}
export function getCoursesByTeacher(teacherId: string): Course[] {
  return COURSES.filter(c => c.teacherId === teacherId)
}
export function getStudentsForCourse(courseId: string): Student[] {
  const course = getCourseById(courseId)
  if (!course) return []
  return course.studentIds.map(id => STUDENTS.find(s => s.id === id)!).filter(Boolean)
}
export function getSessionsForCourse(courseId: string): Session[] {
  return SESSIONS.filter(s => s.courseId === courseId)
}
export function getAttendanceForSession(sessionId: string): Attendance[] {
  return ATTENDANCE.filter(a => a.sessionId === sessionId)
}
export function sessionExistsForDate(courseId: string, date: string): boolean {
  return SESSIONS.some(s => s.courseId === courseId && s.date === date)
}

export function getAttendanceRate(studentId: string, courseId: string): AttendanceRate {
  const sessions = getSessionsForCourse(courseId)
  const total = sessions.length
  if (total === 0) return { studentId, courseId, rate: 0, present: 0, total: 0 }
  const present = sessions.reduce((acc, ses) => {
    const record = ATTENDANCE.find(a => a.sessionId === ses.id && a.studentId === studentId)
    return acc + (record?.status === 'present' ? 1 : 0)
  }, 0)
  return { studentId, courseId, rate: Math.round((present / total) * 100), present, total }
}

export function getCourseAverageAttendance(courseId: string): number {
  const course = getCourseById(courseId)
  if (!course || course.studentIds.length === 0) return 0
  const rates = course.studentIds.map(sid => getAttendanceRate(sid, courseId).rate)
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
}

export function getInstitutionHealth(): number {
  const rates = COURSES.map(c => getCourseAverageAttendance(c.id))
  if (rates.length === 0) return 0
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
}

export function getCriticalAlerts(): CriticalAlert[] {
  const alerts: CriticalAlert[] = []
  COURSES.forEach(course => {
    course.studentIds.forEach(sid => {
      const { rate } = getAttendanceRate(sid, course.id)
      if (rate < 70) {
        const student = getStudentById(sid)
        if (student) alerts.push({ studentId: sid, studentName: student.name, courseId: course.id, courseName: course.name, rate })
      }
    })
  })
  return alerts.sort((a, b) => a.rate - b.rate).slice(0, 5)
}

export function getPresentTodayCount(): number {
  const todayStr = new Date().toISOString().split('T')[0]
  const todaySessions = SESSIONS.filter(s => s.date === todayStr)
  if (todaySessions.length === 0) return 0
  const presentIds = new Set<string>()
  todaySessions.forEach(ses => {
    ATTENDANCE.filter(a => a.sessionId === ses.id && a.status === 'present').forEach(a => presentIds.add(a.studentId))
  })
  return presentIds.size
}

export function getAbsentTodayCount(): number {
  const todayStr = new Date().toISOString().split('T')[0]
  const todaySessions = SESSIONS.filter(s => s.date === todayStr)
  if (todaySessions.length === 0) return 0
  const absentIds = new Set<string>()
  const presentIds = new Set<string>()
  todaySessions.forEach(ses => {
    ATTENDANCE.filter(a => a.sessionId === ses.id).forEach(a => {
      if (a.status === 'present') presentIds.add(a.studentId)
      else absentIds.add(a.studentId)
    })
  })
  return [...absentIds].filter(id => !presentIds.has(id)).length
}

export function getSessionsThisMonth(courseId: string): number {
  const now = new Date()
  return SESSIONS.filter(s => {
    if (s.courseId !== courseId) return false
    const d = new Date(s.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}

export function getWeeklyTrend(studentId: string, courseId: string): WeeklyTrend[] {
  const now = new Date()
  return Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const weekSessions = SESSIONS.filter(s => {
      if (s.courseId !== courseId) return false
      const d = new Date(s.date)
      return d >= weekStart && d < weekEnd
    })
    const total = weekSessions.length
    if (total === 0) return { weekLabel: `W${4 - i}`, rate: 0 }
    const present = weekSessions.filter(ses =>
      ATTENDANCE.some(a => a.sessionId === ses.id && a.studentId === studentId && a.status === 'present')
    ).length
    return { weekLabel: `W${4 - i}`, rate: Math.round((present / total) * 100) }
  }).reverse()
}

export function getCoursesForStudent(studentId: string): Course[] {
  return COURSES.filter(c => c.studentIds.includes(studentId))
}

export function getRecentAttendanceHistory(studentId: string, limit = 10) {
  const studentCourses = getCoursesForStudent(studentId)
  const courseIds = studentCourses.map(c => c.id)
  const records = ATTENDANCE
    .filter(a => a.studentId === studentId)
    .map(a => {
      const session = SESSIONS.find(s => s.id === a.sessionId)
      const course = session ? getCourseById(session.courseId) : undefined
      return session && course && courseIds.includes(session.courseId)
        ? { date: session.date, courseName: course.name, status: a.status }
        : null
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())
    .slice(0, limit)
  return records as { date: string; courseName: string; status: 'present'|'absent' }[]
}

// Mutable sessions/attendance arrays for /attend submissions (runtime only)
let runtimeSessions: Session[] = []
let runtimeAttendance: Attendance[] = []

export function submitSession(data: {
  courseId: string; teacherId: string; date: string
  records: { studentId: string; status: 'present'|'absent' }[]
}): { success: boolean; error?: string } {
  const allSessions = [...SESSIONS, ...runtimeSessions]
  if (allSessions.some(s => s.courseId === data.courseId && s.date === data.date)) {
    return { success: false, error: 'A session has already been submitted for this course today.' }
  }
  const sessionId = `rt-ses-${Date.now()}`
  runtimeSessions.push({ id: sessionId, courseId: data.courseId, date: data.date, submittedBy: data.teacherId })
  data.records.forEach((r, i) => {
    runtimeAttendance.push({ id: `rt-att-${sessionId}-${i}`, sessionId, studentId: r.studentId, status: r.status })
  })
  return { success: true }
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/mock-data.ts
git commit -m "feat: add types and mock data with query functions"
```

---

## Task 3: Auth Context + Route Guards

**Files:**
- Create: `lib/auth-context.tsx`, `components/layout/PrincipalShell.tsx`
- Modify: `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Create `lib/auth-context.tsx`**

```tsx
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { PRINCIPAL } from './mock-data'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function login(email: string, password: string): boolean {
    if (email === PRINCIPAL.email && password === PRINCIPAL.password) {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  function logout() { setIsAuthenticated(false) }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

- [ ] **Step 2: Wrap root layout with AuthProvider**

Edit `app/layout.tsx` — import AuthProvider and wrap children:
```tsx
import { AuthProvider } from '@/lib/auth-context'
// ...
<body ...>
  <AuthProvider>{children}</AuthProvider>
</body>
```

- [ ] **Step 3: Create `app/page.tsx` — root redirect**

```tsx
import { redirect } from 'next/navigation'
export default function RootPage() { redirect('/login') }
```

- [ ] **Step 4: Create `components/layout/PrincipalShell.tsx`**

```tsx
'use client'
import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

export default function PrincipalShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-[100dvh] bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar currentPath={pathname} />
      </div>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/layout/BottomNav.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { House, BookOpen, Users, ChartBar } from '@phosphor-icons/react'

const tabs = [
  { href: '/dashboard', label: 'Dashboard', Icon: House },
  { href: '/courses',   label: 'Courses',   Icon: BookOpen },
  { href: '/students',  label: 'Students',  Icon: Users },
  { href: '/reports',   label: 'Reports',   Icon: ChartBar },
]

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="bg-surface-container-high border-t border-outline-variant/20 px-2 py-2">
      <div className="flex justify-around">
        {tabs.map(({ href, label, Icon }) => {
          const active = currentPath.startsWith(href)
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-4 py-1">
              <Icon size={22} weight={active ? 'fill' : 'regular'}
                className={active ? 'text-primary' : 'text-on-surface-variant'} />
              <span className={`text-[10px] font-label ${active ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 6: Create `components/layout/Sidebar.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { House, BookOpen, Users, ChartBar, SignOut } from '@phosphor-icons/react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: House },
  { href: '/courses',   label: 'Courses',   Icon: BookOpen },
  { href: '/students',  label: 'Students',  Icon: Users },
  { href: '/reports',   label: 'Reports',   Icon: ChartBar },
]

export default function Sidebar({ currentPath }: { currentPath: string }) {
  const { logout } = useAuth()
  const router = useRouter()

  return (
    <aside className="w-56 min-h-[100dvh] bg-surface-container-low flex flex-col py-6 px-3 border-r border-outline-variant/10">
      <div className="px-3 mb-8">
        <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Institution</p>
        <p className="text-sm font-headline font-bold text-on-surface mt-0.5">Elite Academy</p>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, Icon }) => {
          const active = currentPath.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200
                ${active ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
              <Icon size={18} weight={active ? 'fill' : 'regular'} />
              <span className="text-sm font-label font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
      <button onClick={() => { logout(); router.push('/login') }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-tertiary hover:bg-surface-container transition-colors duration-200">
        <SignOut size={18} />
        <span className="text-sm font-label font-medium">Sign Out</span>
      </button>
    </aside>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: auth context, route guard, bottom nav, sidebar"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `components/ui/ProgressNebula.tsx`, `components/ui/StatusBadge.tsx`, `components/ui/StatPill.tsx`, `components/ui/CriticalAlertCard.tsx`, `components/ui/CourseCard.tsx`

- [ ] **Step 1: Create `components/ui/ProgressNebula.tsx`**

```tsx
'use client'
interface Props { value: number; size?: number; strokeWidth?: number }

export default function ProgressNebula({ value, size = 80, strokeWidth = 6 }: Props) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference
  const color = value >= 70 ? '#69f6b8' : value >= 50 ? '#a3a6ff' : '#ff9dd1'

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#006c49" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}80)`, transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}
```

- [ ] **Step 2: Create `components/ui/StatusBadge.tsx`**

```tsx
interface Props { status: 'present' | 'absent' }

export default function StatusBadge({ status }: Props) {
  const isPresent = status === 'present'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-label font-semibold uppercase tracking-wide
      ${isPresent ? 'bg-secondary-container text-secondary' : 'bg-tertiary-container/20 text-tertiary'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-secondary' : 'bg-tertiary'}`} />
      {isPresent ? 'Present' : 'Absent'}
    </span>
  )
}
```

- [ ] **Step 3: Create `components/ui/StatPill.tsx`**

```tsx
interface Props { label: string; value: string | number; accent?: 'mint' | 'rose' | 'indigo' | 'default' }

const accentMap = {
  mint:    'text-secondary',
  rose:    'text-tertiary',
  indigo:  'text-primary',
  default: 'text-on-surface',
}

export default function StatPill({ label, value, accent = 'default' }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 bg-surface-container-high rounded-xl">
      <span className={`text-2xl font-headline font-bold ${accentMap[accent]}`}>{value}</span>
      <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">{label}</span>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/ui/CriticalAlertCard.tsx`**

```tsx
import type { CriticalAlert } from '@/lib/types'
import { Warning } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function CriticalAlertCard({ alert }: { alert: CriticalAlert }) {
  return (
    <Link href={`/students/${alert.studentId}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high hover:bg-surface-bright transition-colors duration-200 group">
      <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
        <Warning size={16} weight="fill" className="text-tertiary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-label font-semibold text-on-surface truncate">{alert.studentName}</p>
        <p className="text-xs font-label text-on-surface-variant truncate">{alert.courseName}</p>
      </div>
      <span className="text-sm font-headline font-bold text-tertiary shrink-0">{alert.rate}%</span>
    </Link>
  )
}
```

- [ ] **Step 5: Create `components/ui/CourseCard.tsx`**

```tsx
import type { Course } from '@/lib/types'
import Link from 'next/link'
import ProgressNebula from './ProgressNebula'

interface Props { course: Course; avgRate: number }

export default function CourseCard({ course, avgRate }: Props) {
  const scheduleLabel = `${course.schedule.days.join(', ')} · ${course.schedule.time}`
  return (
    <Link href={`/courses/${course.id}`}
      className="flex items-center gap-4 p-4 bg-surface-container-high rounded-xl hover:bg-surface-bright transition-colors duration-200">
      <ProgressNebula value={avgRate} size={48} strokeWidth={4} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-headline font-bold text-on-surface truncate">{course.name}</p>
        <p className="text-xs font-label text-on-surface-variant mt-0.5 truncate">{scheduleLabel}</p>
        <p className="text-xs font-label text-on-surface-variant">{course.studentIds.length} students</p>
      </div>
      <span className="text-lg font-headline font-bold text-secondary shrink-0">{avgRate}%</span>
    </Link>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: shared UI components (ProgressNebula, StatusBadge, StatPill, alerts, course card)"
```

---

## Task 5: Login Page

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Create `app/login/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Eye, EyeSlash } from '@phosphor-icons/react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400)) // UX delay
    const ok = login(email, password)
    setLoading(false)
    if (ok) router.push('/dashboard')
    else setError('Invalid credentials. Please try again.')
  }

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">The Nocturne Scholar</p>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Welcome back</h1>
          <p className="text-sm font-label text-on-surface-variant mt-2">Sign in to your principal dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
              placeholder="principal@academy.edu"
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(163,166,255,0.08)] transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 pr-12 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(163,166,255,0.08)] transition-all duration-200"
              />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                {showPass ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs font-label text-tertiary">{error}</p>}
          <button type="submit" disabled={loading}
            className="mt-2 py-3 rounded-xl font-label font-semibold text-sm text-on-primary bg-gradient-to-br from-primary to-primary-container transition-opacity duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify login works in browser**

Navigate to http://localhost:3000/login. Enter `principal@academy.edu` / `nocturne2026`. Should redirect to `/dashboard` (404 for now is fine). Wrong credentials should show error inline.

- [ ] **Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat: principal login page with inline error handling"
```

---

## Task 6: Principal Dashboard

**Files:**
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Create `app/dashboard/page.tsx`**

```tsx
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getInstitutionHealth, getCriticalAlerts, getCourses, getCourseAverageAttendance,
  getPresentTodayCount, getAbsentTodayCount, getStudents
} from '@/lib/mock-data'
import CriticalAlertCard from '@/components/ui/CriticalAlertCard'
import CourseCard from '@/components/ui/CourseCard'
import ProgressNebula from '@/components/ui/ProgressNebula'

export default function DashboardPage() {
  const health = getInstitutionHealth()
  const alerts = getCriticalAlerts()
  const courses = getCourses().slice(0, 4)
  const presentToday = getPresentTodayCount()
  const absentToday = getAbsentTodayCount()
  const totalStudents = getStudents().length

  return (
    <PrincipalShell>
      {/* Mobile layout */}
      <div className="md:hidden px-4 pt-8 pb-4">
        {/* Hero */}
        <div className="mb-6">
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">Current Semester Performance</p>
          <div className="flex items-end gap-3">
            <h1 className="text-6xl font-headline font-bold text-on-surface tracking-tight">{health}%</h1>
          </div>
          <p className="text-xs font-label text-secondary mt-1">Institution-wide attendance</p>
        </div>

        {/* Critical Alerts */}
        {alerts.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-headline font-bold text-on-surface">Critical Alerts</h2>
              <span className="text-[10px] font-label text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">{alerts.length} Active</span>
            </div>
            <div className="flex flex-col gap-2">
              {alerts.map(a => <CriticalAlertCard key={`${a.studentId}-${a.courseId}`} alert={a} />)}
            </div>
          </section>
        )}

        {/* Recent Courses */}
        <section>
          <h2 className="text-sm font-headline font-bold text-on-surface mb-3">Recent Course Attendance</h2>
          <div className="flex flex-col gap-2">
            {courses.map(c => (
              <CourseCard key={c.id} course={c} avgRate={getCourseAverageAttendance(c.id)} />
            ))}
          </div>
        </section>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Attendance Overview</h1>
          <p className="text-sm font-label text-on-surface-variant mt-1">Academic Quarter: Q3 · Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Students', value: totalStudents },
            { label: 'Present Today',  value: presentToday, accent: 'mint' as const },
            { label: 'Absent Today',   value: absentToday,  accent: 'rose' as const },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-high rounded-xl p-5">
              <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-4xl font-headline font-bold tracking-tight ${s.accent === 'mint' ? 'text-secondary' : s.accent === 'rose' ? 'text-tertiary' : 'text-on-surface'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6">
          {/* Course list */}
          <section>
            <h2 className="text-base font-headline font-bold text-on-surface mb-4">Recent Course Attendance</h2>
            <div className="flex flex-col gap-3">
              {getCourses().map(c => (
                <CourseCard key={c.id} course={c} avgRate={getCourseAverageAttendance(c.id)} />
              ))}
            </div>
          </section>

          {/* Right panel */}
          <div className="flex flex-col gap-6">
            {/* Critical Alerts */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-headline font-bold text-on-surface">Critical Alerts</h2>
                <span className="text-[10px] font-label text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">{alerts.length} Active</span>
              </div>
              <div className="flex flex-col gap-2">
                {alerts.length === 0
                  ? <p className="text-sm font-label text-on-surface-variant">No at-risk students.</p>
                  : alerts.map(a => <CriticalAlertCard key={`${a.studentId}-${a.courseId}`} alert={a} />)}
              </div>
            </section>

            {/* Institution Health donut */}
            <section className="bg-surface-container-high rounded-xl p-5 flex flex-col items-center gap-3">
              <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Institution Health</p>
              <div className="relative">
                <ProgressNebula value={health} size={96} strokeWidth={8} />
                <span className="absolute inset-0 flex items-center justify-center text-lg font-headline font-bold text-on-surface">{health}%</span>
              </div>
              <p className="text-xs font-label text-on-surface-variant text-center">Total attendance across all courses is within target range.</p>
            </section>
          </div>
        </div>
      </div>
    </PrincipalShell>
  )
}
```

- [ ] **Step 2: Verify dashboard renders**

Navigate to http://localhost:3000/dashboard after login. Both mobile and desktop layouts should render with real mock data.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: principal dashboard with mobile and desktop layouts"
```

---

## Task 7: Course Directory

**Files:**
- Create: `app/courses/page.tsx`, `app/courses/CourseDirectoryClient.tsx`

- [ ] **Step 1: Create `app/courses/CourseDirectoryClient.tsx`**

```tsx
'use client'
import { useState } from 'react'
import type { Course } from '@/lib/types'
import { MagnifyingGlass } from '@phosphor-icons/react'
import CourseCard from '@/components/ui/CourseCard'

type Filter = 'all' | 'morning' | 'afternoon'

interface Props { courses: Course[]; rates: Record<string, number> }

export default function CourseDirectoryClient({ courses, rates }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(query.toLowerCase())
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'morning' ? c.schedule.time < '12:00' :
      c.schedule.time >= '12:00'
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <div className="relative mb-4">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search classes or instructors…"
          className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-4 py-3 text-sm font-label text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-all duration-200" />
      </div>
      <div className="flex gap-2 mb-5">
        {(['all','morning','afternoon'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-label font-semibold capitalize transition-colors duration-200
              ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
            {f === 'all' ? 'All Classes' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => <CourseCard key={c.id} course={c} avgRate={rates[c.id] ?? 0} />)}
        {filtered.length === 0 && <p className="text-sm font-label text-on-surface-variant col-span-3">No courses match your search.</p>}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create `app/courses/page.tsx`**

```tsx
import PrincipalShell from '@/components/layout/PrincipalShell'
import { getCourses, getCourseAverageAttendance } from '@/lib/mock-data'
import CourseDirectoryClient from './CourseDirectoryClient'

export default function CoursesPage() {
  const courses = getCourses()
  const rates = Object.fromEntries(courses.map(c => [c.id, getCourseAverageAttendance(c.id)]))
  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-8 pb-4">
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface tracking-tight mb-6">Course Directory</h1>
        <CourseDirectoryClient courses={courses} rates={rates} />
      </div>
    </PrincipalShell>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/courses/
git commit -m "feat: course directory with search and morning/afternoon filter"
```

---

## Task 8: Course Detail

**Files:**
- Create: `app/courses/[id]/page.tsx`

- [ ] **Step 1: Create `app/courses/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrincipalShell from '@/components/layout/PrincipalShell'
import StatusBadge from '@/components/ui/StatusBadge'
import {
  getCourseById, getStudentsForCourse, getCourseAverageAttendance,
  getSessionsForCourse, getAttendanceForSession, getSessionsThisMonth,
  getAttendanceRate
} from '@/lib/mock-data'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = getCourseById(params.id)
  if (!course) notFound()

  const students = getStudentsForCourse(params.id)
  const avgRate = getCourseAverageAttendance(params.id)
  const sessionsThisMonth = getSessionsThisMonth(params.id)

  // Get latest session for live present/absent count
  const sessions = getSessionsForCourse(params.id).sort((a, b) => b.date.localeCompare(a.date))
  const latestSession = sessions[0]
  const latestAttendance = latestSession ? getAttendanceForSession(latestSession.id) : []
  const presentCount = latestAttendance.filter(a => a.status === 'present').length
  const absentCount = latestAttendance.filter(a => a.status === 'absent').length

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-8">
        {/* Breadcrumb — desktop only */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-label text-on-surface-variant mb-4">
          <Link href="/courses" className="hover:text-on-surface transition-colors">Courses</Link>
          <CaretRight size={12} />
          <span className="text-on-surface">{course.name}</span>
        </nav>

        <h1 className="text-2xl md:text-4xl font-headline font-bold text-on-surface tracking-tight mb-1">{course.name}</h1>
        <p className="text-sm font-label text-on-surface-variant mb-6">
          {course.schedule.days.join(', ')} · {course.schedule.time} · {course.schedule.room}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-2xl font-headline font-bold text-on-surface">{students.length}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Enrolled</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-2xl font-headline font-bold text-secondary">{presentCount}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Present</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-2xl font-headline font-bold text-tertiary">{absentCount}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Absent</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-label text-on-surface-variant">{sessionsThisMonth} sessions this month · {avgRate}% avg attendance</p>
        </div>

        {/* Student list */}
        <h2 className="text-base font-headline font-bold text-on-surface mb-3">Students</h2>
        <div className="flex flex-col gap-2">
          {students.map(student => {
            const { rate } = getAttendanceRate(student.id, params.id)
            const lastRecord = latestAttendance.find(a => a.studentId === student.id)
            return (
              <Link key={student.id} href={`/students/${student.id}`}
                className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl hover:bg-surface-bright transition-colors duration-200">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-headline font-bold text-primary shrink-0">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-label font-semibold text-on-surface truncate">{student.name}</p>
                  <p className="text-xs font-label text-on-surface-variant">{rate}% overall</p>
                </div>
                {lastRecord && <StatusBadge status={lastRecord.status} />}
              </Link>
            )
          })}
        </div>
      </div>
    </PrincipalShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/courses/[id]/page.tsx
git commit -m "feat: course detail page with student list and attendance stats"
```

---

## Task 9: Student Profile

**Files:**
- Create: `app/students/[id]/page.tsx`, `app/students/page.tsx`

- [ ] **Step 1: Create `app/students/page.tsx` — redirect to dashboard**

```tsx
import { redirect } from 'next/navigation'
export default function StudentsPage() { redirect('/dashboard') }
```

- [ ] **Step 2: Create `app/students/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import PrincipalShell from '@/components/layout/PrincipalShell'
import {
  getStudentById, getCoursesForStudent, getAttendanceRate,
  getWeeklyTrend, getRecentAttendanceHistory
} from '@/lib/mock-data'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressNebula from '@/components/ui/ProgressNebula'

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = getStudentById(params.id)
  if (!student) notFound()

  const courses = getCoursesForStudent(params.id)
  const history = getRecentAttendanceHistory(params.id)
  const initials = student.name.split(' ').map(n => n[0]).join('')

  const totalPresent = courses.reduce((acc, c) => acc + getAttendanceRate(params.id, c.id).present, 0)
  const totalSessions = courses.reduce((acc, c) => acc + getAttendanceRate(params.id, c.id).total, 0)
  const totalAbsent = totalSessions - totalPresent
  const overallRate = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0

  const isAwardEligible = overallRate >= 90

  return (
    <PrincipalShell>
      <div className="px-4 md:px-8 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-xl md:text-2xl font-headline font-bold text-primary shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">Student Profile</p>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface tracking-tight">{student.name}</h1>
            <p className="text-sm font-label text-on-surface-variant mt-0.5">{overallRate}% overall attendance</p>
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-3xl font-headline font-bold text-secondary">{totalPresent}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Present</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-4 text-center">
            <p className="text-3xl font-headline font-bold text-tertiary">{totalAbsent}</p>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-0.5">Absent</p>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* Class-wise breakdown */}
          <section className="mb-8 md:mb-0">
            <h2 className="text-base font-headline font-bold text-on-surface mb-4">Class-wise Breakdown</h2>
            <div className="flex flex-col gap-3">
              {courses.map(course => {
                const { rate } = getAttendanceRate(params.id, course.id)
                return (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
                    <ProgressNebula value={rate} size={40} strokeWidth={4} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-label font-semibold text-on-surface truncate">{course.name}</p>
                      <div className="mt-1.5 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full transition-all duration-700"
                          style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-headline font-bold text-on-surface shrink-0">{rate}%</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recent history */}
          <section>
            <h2 className="text-base font-headline font-bold text-on-surface mb-4">Recent History</h2>
            <div className="flex flex-col gap-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-label font-semibold text-on-surface truncate">{h.courseName}</p>
                    <p className="text-xs font-label text-on-surface-variant">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <StatusBadge status={h.status} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Award banner */}
        {isAwardEligible && (
          <div className="mt-8 p-4 md:p-6 bg-surface-container-high rounded-xl border border-secondary/20">
            <p className="text-sm font-headline font-bold text-secondary mb-1">Excellence Award Eligible</p>
            <p className="text-xs font-label text-on-surface-variant">{student.name} is maintaining {overallRate}% attendance — on track for the Scholar Excellence recognition.</p>
          </div>
        )}
      </div>
    </PrincipalShell>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/students/
git commit -m "feat: student profile with class breakdown, history, and award banner"
```

---

## Task 10: Reports Placeholder

**Files:**
- Create: `app/reports/page.tsx`

- [ ] **Step 1: Create `app/reports/page.tsx`**

```tsx
import PrincipalShell from '@/components/layout/PrincipalShell'
import { ChartBar } from '@phosphor-icons/react/dist/ssr'

export default function ReportsPage() {
  return (
    <PrincipalShell>
      <div className="min-h-[60dvh] flex flex-col items-center justify-center px-4 text-center">
        <ChartBar size={48} className="text-on-surface-variant mb-4" />
        <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">Reports</h1>
        <p className="text-sm font-label text-on-surface-variant max-w-xs">Detailed reporting and export features are coming in the next release.</p>
      </div>
    </PrincipalShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/reports/page.tsx
git commit -m "feat: reports coming soon placeholder"
```

---

## Task 11: Teacher Attendance Page (`/attend`)

**Files:**
- Create: `app/attend/page.tsx`, `components/attend/TeacherSelector.tsx`, `components/attend/StudentToggleList.tsx`, `components/attend/SuccessScreen.tsx`

- [ ] **Step 1: Create `components/attend/SuccessScreen.tsx`**

```tsx
interface Props { teacherName: string; courseName: string; onSubmitAnother: () => void }

export default function SuccessScreen({ teacherName, courseName, onSubmitAnother }: Props) {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#69f6b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">Session Submitted</h1>
      <p className="text-sm font-label text-on-surface-variant max-w-xs mb-1">Attendance for <span className="text-on-surface font-semibold">{courseName}</span> has been recorded.</p>
      <p className="text-xs font-label text-on-surface-variant mb-8">Submitted by {teacherName}</p>
      <button onClick={onSubmitAnother}
        className="px-8 py-3 rounded-xl font-label font-semibold text-sm text-on-primary bg-gradient-to-br from-primary to-primary-container hover:opacity-90 active:scale-[0.98] transition-all duration-200">
        Submit Another Session
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/attend/StudentToggleList.tsx`**

```tsx
'use client'
import type { Student } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'

interface Props {
  students: Student[]
  statuses: Record<string, 'present' | 'absent'>
  onToggle: (studentId: string) => void
}

export default function StudentToggleList({ students, statuses, onToggle }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {students.map(student => {
        const status = statuses[student.id] ?? 'present'
        return (
          <button key={student.id} onClick={() => onToggle(student.id)}
            className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98]
              ${status === 'absent' ? 'bg-tertiary/5 border border-tertiary/20' : 'bg-surface-container-high border border-transparent hover:bg-surface-bright'}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-headline font-bold shrink-0
              ${status === 'absent' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-highest text-primary'}`}>
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="flex-1 text-sm font-label font-semibold text-on-surface">{student.name}</span>
            <StatusBadge status={status} />
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Create `app/attend/page.tsx`**

```tsx
'use client'
import { useState, useMemo } from 'react'
import { getTeachers, getCoursesByTeacher, getStudentsForCourse, submitSession } from '@/lib/mock-data'
import type { Student } from '@/lib/types'
import StudentToggleList from '@/components/attend/StudentToggleList'
import SuccessScreen from '@/components/attend/SuccessScreen'

export default function AttendPage() {
  const teachers = getTeachers()
  const [teacherId, setTeacherId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [statuses, setStatuses] = useState<Record<string, 'present'|'absent'>>({})
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedCourseName, setSubmittedCourseName] = useState('')

  const courses = useMemo(() => teacherId ? getCoursesByTeacher(teacherId) : [], [teacherId])
  const students: Student[] = useMemo(() => courseId ? getStudentsForCourse(courseId) : [], [courseId])

  function handleTeacherChange(id: string) {
    setTeacherId(id)
    setCourseId('')
    setStatuses({})
    setError('')
  }

  function handleCourseChange(id: string) {
    setCourseId(id)
    setError('')
    // Default all students to present
    const s = getStudentsForCourse(id)
    setStatuses(Object.fromEntries(s.map(st => [st.id, 'present'])))
  }

  function toggleStudent(studentId: string) {
    setStatuses(prev => ({ ...prev, [studentId]: prev[studentId] === 'present' ? 'absent' : 'present' }))
  }

  function handleSubmit() {
    if (!teacherId || !courseId) return
    const today = new Date().toISOString().split('T')[0]
    const result = submitSession({
      courseId, teacherId, date: today,
      records: students.map(s => ({ studentId: s.id, status: statuses[s.id] ?? 'present' }))
    })
    if (!result.success) { setError(result.error ?? 'Submission failed.'); return }
    const course = courses.find(c => c.id === courseId)
    setSubmittedCourseName(course?.name ?? '')
    setSubmitted(true)
  }

  function handleSubmitAnother() {
    setCourseId('')
    setStatuses({})
    setError('')
    setSubmitted(false)
    setSubmittedCourseName('')
  }

  const teacher = teachers.find(t => t.id === teacherId)

  if (submitted) {
    return <SuccessScreen teacherName={teacher?.name ?? ''} courseName={submittedCourseName} onSubmitAnother={handleSubmitAnother} />
  }

  const presentCount = Object.values(statuses).filter(s => s === 'present').length
  const absentCount = Object.values(statuses).filter(s => s === 'absent').length

  return (
    <div className="min-h-[100dvh] bg-background px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">Course Tracker</p>
        <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Mark Attendance</h1>
      </div>

      {/* Teacher selector */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Teacher</label>
        <select value={teacherId} onChange={e => handleTeacherChange(e.target.value)}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary transition-all duration-200 appearance-none">
          <option value="">Select teacher…</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Course selector */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Course</label>
        <select value={courseId} onChange={e => handleCourseChange(e.target.value)}
          disabled={!teacherId}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-sm font-label text-on-surface outline-none focus:border-primary transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed">
          <option value="">Select course…</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Student list */}
      {students.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-headline font-bold text-on-surface">Students</h2>
            <div className="flex gap-3 text-xs font-label">
              <span className="text-secondary">{presentCount} present</span>
              <span className="text-tertiary">{absentCount} absent</span>
            </div>
          </div>
          <StudentToggleList students={students} statuses={statuses} onToggle={toggleStudent} />
        </>
      )}

      {error && <p className="mt-4 text-sm font-label text-tertiary">{error}</p>}

      {students.length > 0 && (
        <button onClick={handleSubmit}
          className="mt-6 w-full py-4 rounded-xl font-label font-semibold text-sm text-on-primary bg-gradient-to-br from-primary to-primary-container hover:opacity-90 active:scale-[0.98] transition-all duration-200">
          Submit Session
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify attend flow end-to-end**

Navigate to http://localhost:3000/attend. Select a teacher → courses filter correctly. Select a course → all students default to Present. Toggle a few to Absent. Submit → success screen. Click "Submit Another" → form resets with teacher pre-selected.

Try submitting same course twice in one run → should show inline error.

- [ ] **Step 5: Commit**

```bash
git add app/attend/ components/attend/
git commit -m "feat: teacher attendance submission page with duplicate session guard"
```

---

## Task 12: Final Polish + PWA Verification

**Files:**
- Modify: `app/attend/page.tsx` (add `'use client'` already added), `app/login/page.tsx`, verify all routes

- [ ] **Step 1: Add Framer Motion stagger to student list in attend page**

In `components/attend/StudentToggleList.tsx`, wrap the list:
```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
// wrap container:
<motion.div className="flex flex-col gap-2"
  initial="hidden" animate="visible"
  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
  {students.map(student => (
    <motion.div key={student.id}
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
      <button ...>
```

- [ ] **Step 2: Add stagger to course cards**

In `app/courses/CourseDirectoryClient.tsx`, wrap course list items with the same motion pattern.

- [ ] **Step 3: Verify PWA manifest is served**

```bash
npm run build && npm run start
```
Open http://localhost:3000 in Chrome → DevTools → Application → Manifest. Should show Course Tracker with theme color `#060e20`.

- [ ] **Step 4: Test mobile layout**

In Chrome DevTools, toggle device toolbar to 390px width. Verify:
- Bottom nav visible and functional
- Dashboard hero renders
- Attend page usable on mobile
- No horizontal overflow

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: motion animations, PWA verification, final polish"
```

---

## Summary

| Task | Deliverable |
|---|---|
| 1 | Project bootstrap, Tailwind theme, PWA config |
| 2 | Types + mock data with query functions |
| 3 | Auth context, route guard, nav components |
| 4 | Shared UI components |
| 5 | Login page |
| 6 | Principal dashboard (mobile + desktop) |
| 7 | Course directory with search/filter |
| 8 | Course detail page |
| 9 | Student profile page |
| 10 | Reports placeholder |
| 11 | Teacher attendance page (`/attend`) |
| 12 | Motion polish + PWA verification |
