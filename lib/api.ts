import type {
  ApiAttendanceRecord,
  ApiBook,
  ApiChurch,
  ApiDenomination,
  ApiModule,
  ApiSchoolClass,
  ApiSession,
  ApiStudent,
  ApiTeacher,
  ApiTeacherModuleAssignment,
  AttendanceOverviewData,
  DashboardData,
  ModuleProgress,
  StudentProfile,
  TeacherStats,
} from './api-types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://bishops-school-api-3vlr1ol7.on-forge.com/api'

interface ApiEnvelope<T> {
  data: T
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | undefined | null>
  cache?: RequestCache
  next?: { revalidate?: number | false; tags?: string[] }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, cache, next } = options

  const url = new URL(`${API_BASE_URL}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: cache ?? (next ? undefined : 'no-store'),
    next,
  })

  if (!res.ok) {
    let message = `API ${method} ${path} failed: ${res.status} ${res.statusText}`
    try {
      const errorBody = await res.json()
      if (errorBody?.message) message += ` — ${errorBody.message}`
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  if (res.status === 204) {
    return undefined as T
  }

  const json = (await res.json()) as ApiEnvelope<T>
  return json.data
}

export const api = {
  // Denominations
  listDenominations: () => request<ApiDenomination[]>('/denominations'),
  getDenomination: (id: number) => request<ApiDenomination>(`/denominations/${id}`),
  createDenomination: (body: Omit<ApiDenomination, 'id'>) =>
    request<ApiDenomination>('/denominations', { method: 'POST', body }),
  updateDenomination: (id: number, body: Omit<ApiDenomination, 'id'>) =>
    request<ApiDenomination>(`/denominations/${id}`, { method: 'PUT', body }),
  deleteDenomination: (id: number) =>
    request<void>(`/denominations/${id}`, { method: 'DELETE' }),

  // Churches
  listChurches: (filters?: { denomination_id?: number }) =>
    request<ApiChurch[]>('/churches', { query: filters }),
  getChurch: (id: number) => request<ApiChurch>(`/churches/${id}`),
  createChurch: (body: Omit<ApiChurch, 'id'>) =>
    request<ApiChurch>('/churches', { method: 'POST', body }),
  updateChurch: (id: number, body: Omit<ApiChurch, 'id'>) =>
    request<ApiChurch>(`/churches/${id}`, { method: 'PUT', body }),
  deleteChurch: (id: number) =>
    request<void>(`/churches/${id}`, { method: 'DELETE' }),

  // Classes
  listClasses: (filters?: { teacher_id?: number; category?: string }) =>
    request<ApiSchoolClass[]>('/classes', { query: filters }),
  getClass: (id: number) => request<ApiSchoolClass>(`/classes/${id}`),
  createClass: (body: Partial<ApiSchoolClass> & { name: string }) =>
    request<ApiSchoolClass>('/classes', { method: 'POST', body }),
  updateClass: (id: number, body: Partial<ApiSchoolClass> & { name: string }) =>
    request<ApiSchoolClass>(`/classes/${id}`, { method: 'PUT', body }),
  deleteClass: (id: number) =>
    request<void>(`/classes/${id}`, { method: 'DELETE' }),

  // Teachers
  listTeachers: () => request<ApiTeacher[]>('/teachers'),
  getTeacher: (id: number) => request<ApiTeacher>(`/teachers/${id}`),
  createTeacher: (body: Omit<ApiTeacher, 'id'>) =>
    request<ApiTeacher>('/teachers', { method: 'POST', body }),
  updateTeacher: (id: number, body: Omit<ApiTeacher, 'id'>) =>
    request<ApiTeacher>(`/teachers/${id}`, { method: 'PUT', body }),
  deleteTeacher: (id: number) =>
    request<void>(`/teachers/${id}`, { method: 'DELETE' }),

  // Modules
  listModules: () => request<ApiModule[]>('/modules'),
  getModule: (id: number) => request<ApiModule>(`/modules/${id}`),
  createModule: (body: {
    name: string
    code: string
    books?: Array<{ name: string; chapters: string[] }>
  }) => request<ApiModule>('/modules', { method: 'POST', body }),
  updateModule: (
    id: number,
    body: {
      name: string
      code: string
      books?: Array<{ name: string; chapters: string[] }>
    }
  ) => request<ApiModule>(`/modules/${id}`, { method: 'PUT', body }),
  deleteModule: (id: number) =>
    request<void>(`/modules/${id}`, { method: 'DELETE' }),

  // Books (nested under modules)
  createBook: (
    moduleId: number,
    body: { name: string; chapters: string[]; position?: number }
  ) => request<ApiBook>(`/modules/${moduleId}/books`, { method: 'POST', body }),
  updateBook: (
    id: number,
    body: Partial<{ name: string; chapters: string[]; position: number }>
  ) => request<ApiBook>(`/books/${id}`, { method: 'PUT', body }),
  deleteBook: (id: number) =>
    request<void>(`/books/${id}`, { method: 'DELETE' }),

  // Students
  listStudents: (filters?: { class_id?: number; church_id?: number }) =>
    request<ApiStudent[]>('/students', { query: filters }),
  getStudent: (id: number) => request<ApiStudent>(`/students/${id}`),
  createStudent: (body: Partial<ApiStudent> & { name: string; class_id: number }) =>
    request<ApiStudent>('/students', { method: 'POST', body }),
  updateStudent: (
    id: number,
    body: Partial<ApiStudent> & { name: string; class_id: number }
  ) => request<ApiStudent>(`/students/${id}`, { method: 'PUT', body }),
  deleteStudent: (id: number) =>
    request<void>(`/students/${id}`, { method: 'DELETE' }),
  uploadStudentImage: async (id: number, file: File): Promise<ApiStudent> => {
    const url = `${API_BASE_URL}/students/${id}/image`
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch(url, { method: 'POST', body: formData })
    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`)
    }
    const json = (await res.json()) as ApiEnvelope<ApiStudent>
    return json.data
  },

  // Teacher/Module assignments
  listAssignments: (filters?: { teacher_id?: number; class_id?: number }) =>
    request<ApiTeacherModuleAssignment[]>('/teacher-module-assignments', {
      query: filters,
    }),
  createAssignment: (body: {
    teacher_id: number
    module_id: number
    class_id: number
  }) =>
    request<ApiTeacherModuleAssignment>('/teacher-module-assignments', {
      method: 'POST',
      body,
    }),
  deleteAssignment: (id: number) =>
    request<void>(`/teacher-module-assignments/${id}`, { method: 'DELETE' }),

  // Sessions
  listSessions: (filters?: {
    class_id?: number
    module_id?: number
    teacher_id?: number
  }) => request<ApiSession[]>('/sessions', { query: filters }),
  getSession: (id: number) => request<ApiSession>(`/sessions/${id}`),
  createSession: (body: {
    class_id: number
    module_id: number
    teacher_id: number
    date: string
    book_id: number
    chapter_index: number
    attendance: Array<{
      student_id: number
      status: 'present' | 'absent'
      participation_level?: number
    }>
  }) => request<ApiSession>('/sessions', { method: 'POST', body }),
  deleteSession: (id: number) =>
    request<void>(`/sessions/${id}`, { method: 'DELETE' }),

  // Composite endpoints
  getDashboard: () => request<DashboardData>('/dashboard'),
  getAttendanceOverview: () =>
    request<AttendanceOverviewData>('/attendance-overview'),
  getStudentProfile: (id: number) =>
    request<StudentProfile>(`/students/${id}/profile`),
  getTeacherStats: (id: number) =>
    request<TeacherStats>(`/teachers/${id}/stats`),
  getModuleProgress: (id: number) =>
    request<ModuleProgress>(`/modules/${id}/progress`),
}

export type { ApiAttendanceRecord }
