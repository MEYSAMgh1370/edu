// تعاریف مدل‌های دامنه رشدِ اندیشه

export type UserRole = 'SCHOOL_ADMIN' | 'TEACHER' | 'FINANCE_ADMIN' | 'STUDENT' | 'PARENT' | 'CUSTOM';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  hasPassword: boolean;
  active: boolean;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  level: 'ELEMENTARY' | 'LOWER_SECONDARY' | 'UPPER_SECONDARY';
  levelTitle: string;
  currentAcademicYear: string;
  weekStart: 'SATURDAY' | 'MONDAY';
  timezone: string;
  locale: string;
  address?: string;
  phone?: string;
  website?: string;
  activeModules: ('ACADEMIC' | 'FINANCE' | 'ATTENDANCE' | 'CURRICULUM' | 'STUDY_PLANNER' | 'EXAM')[];
  baleBotEnabled: boolean;
  baleBotToken?: string;
  autoPromotionEnabled: boolean;
  installmentsCount: number;
}

export interface SchoolMembership {
  id: string;
  schoolId: string;
  userId: string;
  user: User;
  role: UserRole;
  roleTitle: string;
  active: boolean;
  createdAt: string;
}

export interface SchoolRole {
  id: string;
  code: string;
  name: string;
  description: string;
  system: boolean;
  permissions: string[];
}

export interface AcademicClass {
  id: string;
  schoolId: string;
  name: string;
  gradeLevel: number; // 1-12
  academicYear: string;
  track?: string; // ریاضی، تجربی، انسانی، عمومی
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
}

export interface Student {
  id: string;
  schoolId: string;
  userId: string;
  name: string;
  nationalCode: string;
  classId: string;
  className: string;
  gradeLevel: number;
  academicYear: string;
  status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED';
  guardians: GuardianLink[];
}

export interface GuardianLink {
  id: string;
  studentId: string;
  guardianName: string;
  guardianPhone: string;
  relationship: 'FATHER' | 'MOTHER' | 'LEGAL_GUARDIAN';
}

export type GradeTerm = 'CONTINUOUS_1' | 'TERM_1' | 'CONTINUOUS_2' | 'TERM_2';

export interface GradeItem {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  classId: string;
  courseId: string;
  courseName: string;
  academicYear: string;
  term: GradeTerm;
  score?: number; // 0-20
  descriptive?: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'NEEDS_EFFORT';
  feedback?: string;
  updatedAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  classId: string;
  date: string; // YYYY/MM/DD Jalali
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AbsenceExcuse {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string;
}

export interface TimetableEntry {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  day: number; // 0: شنبه, 1: یکشنبه, ..., 4: چهارشنبه
  period: number; // 1, 2, 3, 4
  courseName: string;
  teacherId: string;
  teacherName: string;
  room?: string;
}

export interface CurriculumTopic {
  id: string;
  schoolId?: string; // null for platform-wide
  gradeLevel: number;
  courseName: string;
  title: string;
  parentId?: string;
  order: number;
}

export interface QuestionBankItem {
  id: string;
  schoolId?: string;
  topicId: string;
  topicTitle: string;
  courseName: string;
  gradeLevel: number;
  type: 'MULTIPLE_CHOICE' | 'ESSAY';
  questionText: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options?: string[]; // 4 options for multiple choice
  correctOptionIndex?: number; // 0-3
  explanation?: string;
  authorName: string;
}

export interface Exam {
  id: string;
  schoolId: string;
  title: string;
  courseName: string;
  gradeLevel: number;
  durationMinutes: number;
  totalPoints: number;
  passScore: number;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  questions: ExamQuestionRef[];
  assignedClassIds: string[];
}

export interface ExamQuestionRef {
  id: string;
  questionId: string;
  points: number;
  order: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  completedAt?: string;
  answers: { [questionId: string]: number | string };
  score?: number;
  totalPossibleScore: number;
  passed?: boolean;
}

export interface StudyPlan {
  id: string;
  schoolId: string;
  title: string;
  gradeLevel: number;
  weekNumber: number;
  assignedStudentIds: string[];
  intervals: StudyInterval[];
}

export interface StudyInterval {
  id: string;
  planId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // e.g. "16:00"
  durationMinutes: number;
  courseName: string;
  topicTitle: string;
  notes?: string;
  completed?: boolean;
}

export interface StudentInvoice {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  academicYear: string;
  totalAmount: number; // in Rial
  discountAmount: number;
  paidAmount: number;
  installments: InvoiceInstallment[];
}

export interface InvoiceInstallment {
  id: string;
  invoiceId: string;
  installmentNumber: number;
  dueDate: string; // Jalali
  amount: number;
  paidAmount: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
}

export interface PaymentReceipt {
  id: string;
  invoiceId: string;
  installmentId?: string;
  amount: number;
  date: string;
  referenceNumber: string;
  method: 'CARD' | 'BANK_TRANSFER' | 'CASH';
  note?: string;
}

export interface SchoolExpense {
  id: string;
  schoolId: string;
  category: string;
  vendor: string;
  amount: number;
  date: string;
  description: string;
  receiptAttachment?: string;
}

export interface SchoolEvent {
  id: string;
  schoolId: string;
  title: string;
  date: string;
  category: 'EXAM' | 'HOLIDAY' | 'MEETING' | 'ACTIVITY';
  academicYear: string;
  description: string;
  reminderRoles: UserRole[];
}

export interface QuestionBoxItem {
  id: string;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  title: string;
  courseName: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY';
  text: string;
  score: number;
  createdAt: string;
}

export interface QuestionSheet {
  id: string;
  schoolId: string;
  title: string;
  headerDetails: {
    schoolName: string;
    courseName: string;
    gradeTitle: string;
    date: string;
    durationMinutes: number;
    teacherName: string;
  };
  questions: {
    text: string;
    type: 'MULTIPLE_CHOICE' | 'ESSAY';
    score: number;
    options?: string[];
  }[];
}
