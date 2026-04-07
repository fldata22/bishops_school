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
