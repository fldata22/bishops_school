# Course Tracker — Design Spec
**Date:** 2026-04-07
**Status:** Approved

---

## 1. Overview

A mobile-first PWA for tracking student attendance across courses. Two completely separate user experiences share a single codebase: a public teacher attendance submission page (no login) and a full principal dashboard (login required).

---

## 2. App Structure

### Surface 1 — Teacher Attendance Page (`/attend`)
Public. No authentication required.

1. Teacher selects their name from a dropdown (filtered list of all teachers)
2. Course dropdown then shows only courses assigned to the selected teacher
3. All enrolled students default to **Present**
4. Teacher taps individual students to toggle to **Absent** (two states only: Present / Absent)
5. "Submit Session" button finalises the record
6. Success confirmation screen shown after submission

### Surface 2 — Principal Dashboard (`/login`, `/dashboard`, etc.)
Login required. Uses hardcoded principal credentials stored in mock data. On failed login, an inline error message is shown ("Invalid credentials"). On success, a role context is set and the user is redirected to `/dashboard`.

**Mobile navigation:** Bottom tab bar — Dashboard / Courses / Students / Reports
**Desktop navigation:** Left sidebar with icon + label — Dashboard / Courses / Students / Reports

---

## 3. Screens

### Teacher (`/attend`)
Single-page flow:
- Teacher dropdown (all teachers)
- Course dropdown (only courses belonging to selected teacher, disabled until teacher is selected)
- Student list (all Present by default, tap to toggle Absent)
- "Submit Session" CTA
- Success confirmation state (full-screen, with option to submit another session — teacher name is pre-filled, course resets to empty)

### Principal — Mobile

| Route | Screen | Key Content |
|---|---|---|
| `/dashboard` | Dashboard | Attendance % hero, Critical Alerts (at-risk students), Recent Courses list |
| `/courses` | Course Directory | Search + Morning/Afternoon filter tabs, course cards with attendance % badge |
| `/courses/[id]` | Course Detail | Present/Absent count, student list with Present/Absent status badges; tap a student to navigate to `/students/[id]` |
| `/students/[id]` | Student Profile | Stats pills (Present count, Absent count), class-wise breakdown with progress bars, recent history |

### Principal — Desktop

| Route | Screen | Key Content |
|---|---|---|
| `/dashboard` | Attendance Overview | Stats row (Total Students, Present Today, Absent, Late Arrival), course table, Critical Alerts panel, Institution Health donut |
| `/courses` | Course Directory | Grid of course cards, search bar, subject/time filters |
| `/courses/[id]` | Course Detail | Breadcrumb nav, enrolled/present/absent counts, student table (status + last active + actions); click a student row to navigate to `/students/[id]` |
| `/students/[id]` | Student Profile | Photo header, stat row, class-wise breakdown, recent history timeline, award eligibility banner |
| `/reports` | Reports | "Coming Soon" placeholder screen — navigation tab visible but feature not yet implemented |

---

## 4. Data Model (Mock)

All data lives in `/lib/mock-data.ts`. Every data-fetching function is isolated so it can be replaced with a real API call without touching components.

```ts
Principal  { id, name, email, password }   // hardcoded credentials for mock auth

Teacher    { id, name }
// courses are queried by filtering Course[] where course.teacherId === teacher.id
// Teacher does NOT store courseIds[] — derive from Course records to avoid drift

Course     { id, name, teacherId, studentIds[], schedule: { days[], time, room } }
// schedule.days[]: array of 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
// schedule.time: 24h string e.g. "09:00", "14:30"

Student    { id, name }
// course membership derived from Course.studentIds[]

Session    { id, courseId, date, submittedBy: teacherId }
// date: ISO string e.g. "2026-04-07"
// Uniqueness constraint: one session per courseId per date. If a teacher submits
// a session for a course on a date that already has a session, the /attend page
// shows an inline error: "A session has already been submitted for this course today."
// Mock data must include at least one session dated to the current calendar date
// so that "Present Today" on the dashboard renders a non-zero value.

Attendance { id, sessionId, studentId, status: 'present' | 'absent' }
// sessionId is the single source of truth for the Session ↔ Attendance relationship.
// Do NOT store attendanceIds[] on Session — query Attendance[] by sessionId instead.
// 'late' and 'excused' statuses are out of scope. The student profile shows
// Present count and Absent count only.
```

**Derived stats** (computed at query time, never stored):
- Attendance rate per student per course: `present sessions / total sessions` for that course
- At-risk flag: student below 70% attendance in any enrolled course
- Course average attendance rate: mean of all student rates in the course
- Weekly trend: attendance rate for each of the last 4 weeks
- Institution Health %: school-wide attendance rate (mean across all courses)
- Sessions held this month: count of Session records for a course in the current calendar month

---

## 5. Key Stats Surfaced

| Stat | Where |
|---|---|
| School-wide attendance % | Principal dashboard hero |
| Total Students / Present Today / Absent | Principal dashboard stats row |
| At-risk student alerts (< 70%, shown per student with course context, capped at top 5 by lowest rate) | Principal dashboard Critical Alerts panel |
| Course average attendance | Course card, course detail |
| Per-student attendance rate per course | Student profile, class-wise breakdown |
| Attendance trend (4-week) | Student profile |
| Sessions held this month | Course detail |
| Institution Health % (= school-wide attendance rate, same as hero value) | Principal dashboard donut |

**Stat definitions:**
- **Total Students:** count of all Student records
- **Present Today:** count of distinct students marked `present` in at least one session on the current calendar date. If no sessions exist today, show 0.
- **Absent:** count of distinct students who appear in at least one of today's sessions but have no `present` attendance record in any of today's sessions. If no sessions exist today, show 0.
- **Attendance rate denominator:** all Session records for the course, regardless of when the student was enrolled (enrollment is static in mock data).
- **Morning/Afternoon filter:** Morning = `schedule.time < "12:00"`; Afternoon = `schedule.time >= "12:00"`.

**Critical Alerts definition:** Any student whose attendance rate drops below 70% in at least one enrolled course. Shown as a list of student names with the affected course and their current rate. Sorted by severity (lowest rate first). Capped at 5 entries on the dashboard panel.

**Teacher success state:** Pre-fill uses component-level state only (not localStorage) to avoid persisting across sessions on shared devices.

---

## 6. Design System — "The Nocturne Scholar"

### Palette
| Token | Value | Usage |
|---|---|---|
| Background | `#060e20` | Page base |
| Primary (Indigo) | `#a3a6ff` | Accent, CTAs, focus states |
| Secondary (Mint) | `#69f6b8` | Success, progress, Present status |
| Tertiary (Rose) | `#ff9dd1` | Alerts, Absent status, Critical Alerts |
| Surface stack | Tonal slate tiers | Depth without borders |

### Typography
- **Headings:** Manrope — tight tracking (`-0.01em` to `-0.02em`), geometric authority
- **Body/UI:** Inter — tall x-height, `0.875rem` body, `1.6` line-height

### Surface Hierarchy
No dividers. Depth through tonal stacking:
```
Background → Surface → Surface-container-low → Surface-container-high → Surface-container-highest
```

### Component Patterns
- **Progress Nebula:** Circular attendance indicator, Mint track, Indigo glow
- **Status badges:** Present (Mint) / Absent (Rose)
- **Ghost borders:** 0.5px, `outline-variant` at 20% opacity — accessibility only
- **CTAs:** Gradient fill (`primary` → `primary-container`), `md` radius, no border
- **Cards:** `surface-container-highest` bg, `xl` radius (`0.75rem`), ambient shadow tinted with 5% primary
- **Inputs:** `surface-container-lowest` bg, primary border + 8% glow on focus
- **No dividers:** List items separated by 12px gap + hover state only

### Motion
- All hover transitions: `200ms cubic-bezier(0.4, 0, 0.2, 1)`
- Interactive elements: Framer Motion spring (`stiffness: 100, damping: 20`)
- List/grid reveals: staggered children with `staggerChildren: 0.05`
- Perpetual animations isolated in their own `React.memo` Client Components

---

## 7. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Icons | `@phosphor-icons/react` |
| Fonts | Manrope + Inter (Google Fonts) |
| PWA | `next-pwa` (manifest + service worker) |
| Data | Mock data in `/lib/mock-data.ts` |
| Auth | Hardcoded principal credentials in mock data; role stored in React context; no real auth |

---

## 8. Routes

```
/               Redirect → /login
/login          Principal login (hardcoded credentials, inline error on failure)
/dashboard      Principal dashboard
/courses        Course directory
/courses/[id]   Course detail
/students/[id]  Student profile (navigated to by clicking a student in course detail)
/reports        Coming Soon placeholder (auth-protected, principal only)
/attend         Teacher attendance submission (public, no auth)
```

---

## 9. Out of Scope (for now)

- Real authentication / JWT / sessions
- Database / backend API
- Teacher login or teacher-side stats views
- Late arrival tracking (teacher flow is present/absent only)
- Report generation / export
- Push notifications for at-risk alerts
- Admin user management
- PWA offline behaviour
