// Types that mirror the bishops-school-api JSON shape.
// Distinct from lib/types.ts (legacy mock-data types) so the migration
// can proceed page-by-page without breaking unmigrated pages.

export type ClassCategory = 'non_consecrated' | 'newly_consecrated'
export type Gender = 'male' | 'female'
export type AttendanceStatus = 'present' | 'absent'
export type ParticipationLevel = 1 | 2 | 3 | 4

export interface ApiDenomination {
  id: number
  name: string
  abbreviation: string
}

export interface ApiChurch {
  id: number
  name: string
  denomination_id: number
}

export interface ApiTeacher {
  id: number
  name: string
}

export interface ApiSchoolClass {
  id: number
  name: string
  teacher_id: number | null
  category: ClassCategory | null
  teacher?: ApiTeacher
}

export interface ApiBook {
  id: number
  module_id: number
  name: string
  chapters: string[]
  position: number
}

export interface ApiModule {
  id: number
  name: string
  code: string
  books: ApiBook[]
}

export interface ApiStudent {
  id: number
  name: string
  class_id: number
  church_id: number | null
  gender: Gender | null
  country: string | null
  image: string | null
}

export interface ApiTeacherModuleAssignment {
  id: number
  teacher_id: number
  module_id: number
  class_id: number
  teacher?: ApiTeacher
  module?: ApiModule
  school_class?: ApiSchoolClass
}

export interface ApiAttendanceRecord {
  id: number
  session_id: number
  student_id: number
  status: AttendanceStatus
  participation_level: ParticipationLevel | null
  student?: ApiStudent
}

export interface ApiSession {
  id: number
  class_id: number
  module_id: number
  teacher_id: number
  date: string
  book_id: number
  chapter_index: number
  school_class?: ApiSchoolClass
  module?: ApiModule
  teacher?: ApiTeacher
  book?: ApiBook
  attendance_records?: ApiAttendanceRecord[]
}

// ─── Composite endpoint responses ────────────────────────────────

export interface TeacherTarget {
  id: number
  name: string
  rate: number
  rating: 'Excellent' | 'Good' | 'Needs Improvement'
}

export interface DashboardData {
  overall_class_attendance: number
  overall_module_attendance: number
  students_enrolled: number
  teacher_count: number
  teacher_targets: TeacherTarget[]
}

export interface CriticalAlertRow {
  student_id: number
  student_name: string
  class_name: string
  consecutive_absences: number
}

export interface ClassAttendanceRow {
  class_id: number
  class_name: string
  rate: number
  sessions_this_month: number
  present: number
  total: number
}

export interface ModuleAttendanceRow {
  module_id: number
  module_name: string
  code: string
  sessions: number
  topics: number
  rate: number
}

export interface TeacherActivityRow {
  teacher_id: number
  teacher_name: string
  sessions: number
  percentage_of_total: number
}

export interface WeeklyTrendPoint {
  week: string
  rate: number
}

export interface AttendanceOverviewData {
  overall_rate: number
  total_students: number
  present_today: number
  absent_today: number
  teacher_count: number
  critical_alerts: CriticalAlertRow[]
  class_attendance: ClassAttendanceRow[]
  module_attendance: ModuleAttendanceRow[]
  teacher_activity: TeacherActivityRow[]
  weekly_trends: WeeklyTrendPoint[]
}

export interface StudentModuleBreakdown {
  module_id: number
  module_name: string
  rate: number
}

export interface StudentProfile {
  student: {
    id: number
    name: string
    class: string
    church: string | null
    gender: Gender | null
  }
  attendance_rate: number
  present_count: number
  absent_count: number
  participation_average: number | null
  module_breakdown: StudentModuleBreakdown[]
}

export interface TeacherClassStat {
  class_id: number
  class_name: string
  sessions: number
  attendance_rate: number
}

export interface TeacherMonthlyStat {
  month: string
  sessions: number
}

export interface TeacherStats {
  teacher: { id: number; name: string }
  total_sessions: number
  classes: TeacherClassStat[]
  monthly_breakdown: TeacherMonthlyStat[]
}

export interface ModuleClassBreakdown {
  class_id: number
  class_name: string
  rate: number
  sessions: number
}

export interface ModuleBookBreakdown {
  book_id: number
  book_name: string
  total_chapters: number
  chapters_taught: number
  rate: number
}

export interface ChapterAttendanceRow {
  book_id: number
  book_name: string
  chapter_index: number
  chapter_name: string
  rate: number | null
}

export interface ModuleProgress {
  module: { id: number; name: string; code: string; total_chapters: number }
  completion_rate: number
  chapters_taught: number
  attendance_rate: number
  class_breakdown: ModuleClassBreakdown[]
  book_breakdown: ModuleBookBreakdown[]
  chapter_attendance: ChapterAttendanceRow[]
}
