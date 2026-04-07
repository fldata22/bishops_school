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

// Attendance records — deterministic rates
// s2 (Julian Rivera) ~24% in c1 — at-risk
// s9 (Nadia Volkov) ~50% in c2, ~30% in c5 — at-risk
export const ATTENDANCE: Attendance[] = [
  // c1 sessions
  ...(() => {
    const c1Sessions = SESSIONS.filter(s => s.courseId === 'c1')
    const c1Students = ['s1','s2','s3','s4','s5','s6']
    const records: Attendance[] = []
    c1Sessions.forEach((ses, si) => {
      c1Students.forEach((stdId, stIdx) => {
        const present = stdId === 's2' ? si < 4 : (si + stIdx) % 9 !== 0
        records.push({ id: `att-${ses.id}-${stdId}`, sessionId: ses.id, studentId: stdId, status: present ? 'present' : 'absent' })
      })
    })
    return records
  })(),
  // c2 sessions
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
  // c3 sessions
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
  // c5 sessions
  ...(() => {
    const sessions = SESSIONS.filter(s => s.courseId === 'c5')
    const students = ['s7','s9','s11','s13','s15']
    const records: Attendance[] = []
    sessions.forEach((ses, si) => {
      students.forEach((stdId, stIdx) => {
        const present = stdId === 's9' ? si % 4 === 0 : (si + stIdx) % 10 !== 0
        records.push({ id: `att-${ses.id}-${stdId}`, sessionId: ses.id, studentId: stdId, status: present ? 'present' : 'absent' })
      })
    })
    return records
  })(),
]

// ─── Runtime mutable arrays (for /attend submissions) ────────────────────────

const runtimeSessions: Session[] = []
const runtimeAttendance: Attendance[] = []

// ─── Query Functions ─────────────────────────────────────────────────────────

export function getAllTeachers(): Teacher[] { return TEACHERS }
export function getAllStudents(): Student[] { return STUDENTS }
export function getAllCourses(): Course[]   { return COURSES }

// ─── Aliases expected by downstream tasks ────────────────────────────────────
export function getTeachers(): Teacher[] { return TEACHERS }
export function getStudents(): Student[] { return STUDENTS }
export function getCourses(): Course[]   { return COURSES }

export function getAllSessions(): Session[] {
  return [...SESSIONS, ...runtimeSessions]
}

export function getAllAttendance(): Attendance[] {
  return [...ATTENDANCE, ...runtimeAttendance]
}

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
export function getStudentsByCourse(courseId: string): Student[] {
  const course = getCourseById(courseId)
  if (!course) return []
  return course.studentIds.map(id => STUDENTS.find(s => s.id === id)!).filter(Boolean)
}
export function getStudentsForCourse(courseId: string): Student[] { return getStudentsByCourse(courseId) }

export function getSessionsByCourse(courseId: string): Session[] {
  return [...SESSIONS, ...runtimeSessions].filter(s => s.courseId === courseId)
}
export function getSessionsForCourse(courseId: string): Session[] { return getSessionsByCourse(courseId) }
export function getAttendanceForSession(sessionId: string): Attendance[] {
  return getAllAttendance().filter(a => a.sessionId === sessionId)
}
export function getAttendanceByCourse(courseId: string): Attendance[] {
  const sessionIds = new Set(getSessionsByCourse(courseId).map(s => s.id))
  return getAllAttendance().filter(a => sessionIds.has(a.sessionId))
}
export function sessionExistsForDate(courseId: string, date: string): boolean {
  return getAllSessions().some(s => s.courseId === courseId && s.date === date)
}

export function getAttendanceRate(studentId: string, courseId: string): AttendanceRate {
  const sessions = getSessionsByCourse(courseId)
  const total = sessions.length
  if (total === 0) return { studentId, courseId, rate: 0, present: 0, total: 0 }
  const allAtt = getAllAttendance()
  const present = sessions.reduce((acc, ses) => {
    const record = allAtt.find(a => a.sessionId === ses.id && a.studentId === studentId)
    return acc + (record?.status === 'present' ? 1 : 0)
  }, 0)
  return { studentId, courseId, rate: Math.round((present / total) * 100), present, total }
}

export function getCourseAttendanceAverage(courseId: string): number {
  const course = getCourseById(courseId)
  if (!course || course.studentIds.length === 0) return 0
  const rates = course.studentIds.map(sid => getAttendanceRate(sid, courseId).rate)
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
}
export function getCourseAverageAttendance(courseId: string): number { return getCourseAttendanceAverage(courseId) }

export function getInstitutionHealth(): number {
  const rates = COURSES.map(c => getCourseAttendanceAverage(c.id))
  if (rates.length === 0) return 0
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
}

export function getSchoolwideAttendanceRate(): number {
  return getInstitutionHealth()
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
  const todaySessions = getAllSessions().filter(s => s.date === todayStr)
  if (todaySessions.length === 0) return 0
  const allAtt = getAllAttendance()
  const presentIds = new Set<string>()
  todaySessions.forEach(ses => {
    allAtt.filter(a => a.sessionId === ses.id && a.status === 'present').forEach(a => presentIds.add(a.studentId))
  })
  return presentIds.size
}

export function getAbsentTodayCount(): number {
  const todayStr = new Date().toISOString().split('T')[0]
  const todaySessions = getAllSessions().filter(s => s.date === todayStr)
  if (todaySessions.length === 0) return 0
  const allAtt = getAllAttendance()
  const absentIds = new Set<string>()
  const presentIds = new Set<string>()
  todaySessions.forEach(ses => {
    allAtt.filter(a => a.sessionId === ses.id).forEach(a => {
      if (a.status === 'present') presentIds.add(a.studentId)
      else absentIds.add(a.studentId)
    })
  })
  return Array.from(absentIds).filter(id => !presentIds.has(id)).length
}

export function getSessionsThisMonth(courseId: string): number {
  const now = new Date()
  return getAllSessions().filter(s => {
    if (s.courseId !== courseId) return false
    const d = new Date(s.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}

// Per-student, per-course weekly trend (spec: plan Task 2 line 604)
export function getWeeklyTrend(studentId: string, courseId: string): WeeklyTrend[] {
  const now = new Date()
  const allSessions = getAllSessions()
  const allAtt = getAllAttendance()
  return Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const weekSessions = allSessions.filter(s => {
      if (s.courseId !== courseId) return false
      const d = new Date(s.date)
      return d >= weekStart && d < weekEnd
    })
    const total = weekSessions.length
    if (total === 0) return { weekLabel: `W${4 - i}`, rate: 0 }
    const present = weekSessions.filter(ses =>
      allAtt.some(a => a.sessionId === ses.id && a.studentId === studentId && a.status === 'present')
    ).length
    return { weekLabel: `W${4 - i}`, rate: Math.round((present / total) * 100) }
  }).reverse()
}

// Course-wide or school-wide weekly trend (for dashboard use)
export function getCourseWeeklyTrend(courseId?: string): WeeklyTrend[] {
  const now = new Date()
  const allSessions = getAllSessions()
  const allAtt = getAllAttendance()
  return Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const weekSessions = allSessions.filter(s => {
      if (courseId && s.courseId !== courseId) return false
      const d = new Date(s.date)
      return d >= weekStart && d < weekEnd
    })
    const total = weekSessions.length
    if (total === 0) return { weekLabel: `W${4 - i}`, rate: 0 }
    const presentCount = weekSessions.reduce((acc, ses) => {
      const recs = allAtt.filter(a => a.sessionId === ses.id)
      const pres = recs.filter(a => a.status === 'present').length
      return acc + (recs.length > 0 ? pres / recs.length : 0)
    }, 0)
    return { weekLabel: `W${4 - i}`, rate: Math.round((presentCount / total) * 100) }
  }).reverse()
}

export function getCoursesForStudent(studentId: string): Course[] {
  return COURSES.filter(c => c.studentIds.includes(studentId))
}

export function getRecentAttendanceHistory(studentId: string, limit = 10): Array<{ date: string; courseName: string; status: 'present' | 'absent' }> {
  const allAtt = getAllAttendance()
  const allSess = getAllSessions()
  const studentCourses = getCoursesForStudent(studentId)
  const results: Array<{ date: string; courseName: string; status: 'present' | 'absent' }> = []
  studentCourses.forEach(course => {
    const courseSessions = allSess.filter(s => s.courseId === course.id)
    courseSessions.forEach(ses => {
      const record = allAtt.find(a => a.sessionId === ses.id && a.studentId === studentId)
      if (record) {
        results.push({ date: ses.date, courseName: course.name, status: record.status })
      }
    })
  })
  return results
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function submitSession(data: {
  courseId: string; teacherId: string; date: string
  records: { studentId: string; status: 'present'|'absent' }[]
}): { success: boolean; error?: string } {
  const allSessions = getAllSessions()
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
