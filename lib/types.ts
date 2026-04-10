export interface Principal {
  id: string
  name: string
  email: string
  password: string
}

export interface Denomination {
  id: string
  name: string
  abbreviation: string
}

export interface Church {
  id: string
  name: string
  denominationId: string
}

export interface Class {
  id: string
  name: string  // "Makarios" | "Poimen"
  teacherId: string
}

export interface Teacher {
  id: string
  name: string
}

export interface Book {
  id: string
  name: string
  chapters: string[]
}

export interface Module {
  id: string
  name: string
  code: string
  books: Book[]
}


export interface Student {
  id: string
  name: string
  classId: string
  churchId: string
  gender: 'male' | 'female'
}

export interface Session {
  id: string
  classId: string
  moduleId: string
  teacherId: string
  date: string  // ISO date string 'YYYY-MM-DD'
  bookId: string
  chapterIndex: number
}

export interface Attendance {
  id: string
  sessionId: string
  studentId: string
  status: 'present' | 'absent'
  participationLevel?: 1 | 2 | 3 | 4
}

export interface AttendanceRate {
  present: number
  total: number
  rate: number
}

export interface CriticalAlert {
  studentId: string
  studentName: string
  classId: string
  className: string
  consecutiveAbsences: number
}

export interface WeeklyTrend {
  week: string
  rate: number
}
