import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  School,
  SchoolMembership,
  UserRole,
  AcademicClass,
  Student,
  GradeItem,
  AttendanceRecord,
  AbsenceExcuse,
  TimetableEntry,
  CurriculumTopic,
  QuestionBankItem,
  Exam,
  ExamAttempt,
  StudyPlan,
  StudentInvoice,
  PaymentReceipt,
  SchoolExpense,
  SchoolEvent,
  QuestionBoxItem,
  QuestionSheet,
  SchoolRole
} from '../types';
import { getTodayJalali } from '../utils/jalali';

interface AppContextType {
  currentUser: User | null;
  currentSchool: School | null;
  currentRole: UserRole;
  schools: School[];
  memberships: SchoolMembership[];
  classes: AcademicClass[];
  students: Student[];
  grades: GradeItem[];
  attendance: AttendanceRecord[];
  excuses: AbsenceExcuse[];
  timetable: TimetableEntry[];
  topics: CurriculumTopic[];
  questionBank: QuestionBankItem[];
  exams: Exam[];
  examAttempts: ExamAttempt[];
  studyPlans: StudyPlan[];
  invoices: StudentInvoice[];
  receipts: PaymentReceipt[];
  expenses: SchoolExpense[];
  events: SchoolEvent[];
  questionBoxItems: QuestionBoxItem[];
  questionSheets: QuestionSheet[];
  roles: SchoolRole[];

  // Actions
  login: (email: string) => boolean;
  logout: () => void;
  setCurrentSchoolId: (id: string) => void;
  setCurrentRole: (role: UserRole) => void;
  createSchool: (newSchool: Partial<School>) => School;
  updateSchoolSettings: (settings: Partial<School>) => void;
  
  // People & Roles
  addMember: (name: string, email: string, phone: string, role: UserRole) => void;
  toggleMemberActive: (id: string) => void;
  createCustomRole: (name: string, description: string, permissions: string[]) => void;

  // Classes & Students
  addClass: (name: string, gradeLevel: number, track: string, teacherId?: string) => void;
  addStudent: (name: string, nationalCode: string, classId: string, guardianName?: string, guardianPhone?: string) => void;

  // Grades
  saveGrade: (grade: Omit<GradeItem, 'id' | 'updatedAt'>) => void;

  // Attendance
  saveAttendanceRoll: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  submitExcuse: (studentId: string, date: string, reason: string) => void;
  decideExcuse: (id: string, status: 'APPROVED' | 'REJECTED', adminComment?: string) => void;

  // Timetable
  saveTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  removeTimetableEntry: (id: string) => void;

  // Curriculum & Questions
  addTopic: (title: string, courseName: string, gradeLevel: number) => void;
  addQuestion: (q: Omit<QuestionBankItem, 'id'>) => void;

  // Exams
  createExam: (exam: Omit<Exam, 'id' | 'questions'>, questionIds: string[]) => void;
  submitExamAttempt: (attempt: Omit<ExamAttempt, 'id' | 'completedAt'>) => ExamAttempt;

  // Study Planner
  toggleIntervalCompleted: (planId: string, intervalId: string) => void;
  createStudyPlan: (plan: Omit<StudyPlan, 'id'>) => void;

  // Finance
  setSchoolTuition: (amount: number, installmentsCount: number) => void;
  recordPayment: (invoiceId: string, amount: number, refNum: string, method: 'CARD' | 'BANK_TRANSFER' | 'CASH', note?: string) => void;
  applyDiscount: (invoiceId: string, discountAmount: number) => void;
  addExpense: (expense: Omit<SchoolExpense, 'id'>) => void;

  // Events & Question Box
  addEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  addQuestionBoxItem: (item: Omit<QuestionBoxItem, 'id' | 'createdAt'>) => void;
  createQuestionSheet: (sheet: Omit<QuestionSheet, 'id'>) => void;
  runPromotion: () => { promotedCount: number; graduatedCount: number };
}

// Demo Data
const INITIAL_USERS: User[] = [
  { id: 'u-1', name: 'مهندس حسینی (مدیر)', email: 'admin@roshdeandishe.test', phone: '09121112233', hasPassword: true, active: true },
  { id: 'u-2', name: 'استاد حمیدرضا رضایی', email: 'rezaei@roshdeandishe.test', phone: '09123334455', hasPassword: true, active: true },
  { id: 'u-3', name: 'حسابدار اکبری', email: 'akbari@roshdeandishe.test', phone: '09125556677', hasPassword: true, active: true },
  { id: 'u-4', name: 'علی کمالی (دانش‌آموز)', email: 'ali.kamali@roshdeandishe.test', phone: '09351112233', hasPassword: true, active: true },
  { id: 'u-5', name: 'محمد کمالی (ولی دانش‌آموز)', email: 'parent.kamali@roshdeandishe.test', phone: '09128889900', hasPassword: true, active: true },
];

const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-1',
    name: 'دبیرستان هوشمند رشدِ اندیشه',
    slug: 'roshdeandishe',
    level: 'UPPER_SECONDARY',
    levelTitle: 'متوسطه دوم (پایه‌های دهم تا دوازدهم)',
    currentAcademicYear: '1403-1404',
    weekStart: 'SATURDAY',
    timezone: 'Asia/Tehran',
    locale: 'fa-IR',
    address: 'تهران، خیابان ولی‌عصر، بالاتر از میدان ونک، پلاک ۲۴',
    phone: '021-88776655',
    website: 'https://roshdeandishe.ir',
    activeModules: ['ACADEMIC', 'FINANCE', 'ATTENDANCE', 'CURRICULUM', 'STUDY_PLANNER', 'EXAM'],
    baleBotEnabled: true,
    baleBotToken: 'bot149302:AAG821xL0...',
    autoPromotionEnabled: false,
    installmentsCount: 4,
  },
  {
    id: 'sch-2',
    name: 'مدرسه راهنمایی اندیشه‌سازان',
    slug: 'andishe-sazan',
    level: 'LOWER_SECONDARY',
    levelTitle: 'متوسطه اول (پایه‌های هفتم تا نهم)',
    currentAcademicYear: '1403-1404',
    weekStart: 'SATURDAY',
    timezone: 'Asia/Tehran',
    locale: 'fa-IR',
    address: 'شیراز، خیابان زند، پلاک ۱۲',
    phone: '071-32334455',
    activeModules: ['ACADEMIC', 'FINANCE', 'ATTENDANCE'],
    baleBotEnabled: false,
    autoPromotionEnabled: false,
    installmentsCount: 3,
  }
];

const INITIAL_MEMBERSHIPS: SchoolMembership[] = [
  { id: 'm-1', schoolId: 'sch-1', userId: 'u-1', user: INITIAL_USERS[0], role: 'SCHOOL_ADMIN', roleTitle: 'مدیر مدرسه', active: true, createdAt: '1403/07/01' },
  { id: 'm-2', schoolId: 'sch-1', userId: 'u-2', user: INITIAL_USERS[1], role: 'TEACHER', roleTitle: 'دبیر / معلم', active: true, createdAt: '1403/07/01' },
  { id: 'm-3', schoolId: 'sch-1', userId: 'u-3', user: INITIAL_USERS[2], role: 'FINANCE_ADMIN', roleTitle: 'مدیر امور مالی', active: true, createdAt: '1403/07/01' },
  { id: 'm-4', schoolId: 'sch-1', userId: 'u-4', user: INITIAL_USERS[3], role: 'STUDENT', roleTitle: 'دانش‌آموز', active: true, createdAt: '1403/07/01' },
  { id: 'm-5', schoolId: 'sch-1', userId: 'u-5', user: INITIAL_USERS[4], role: 'PARENT', roleTitle: 'ولی / اولیا', active: true, createdAt: '1403/07/01' },
];

const INITIAL_CLASSES: AcademicClass[] = [
  { id: 'c-1', schoolId: 'sch-1', name: 'کلاس دهم تجربی الف', gradeLevel: 10, academicYear: '1403-1404', track: 'علوم تجربی', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', studentCount: 28 },
  { id: 'c-2', schoolId: 'sch-1', name: 'کلاس دهم ریاضی الف', gradeLevel: 10, academicYear: '1403-1404', track: 'ریاضی فیزیک', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', studentCount: 25 },
  { id: 'c-3', schoolId: 'sch-1', name: 'کلاس یازدهم تجربی', gradeLevel: 11, academicYear: '1403-1404', track: 'علوم تجربی', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', studentCount: 30 },
  { id: 'c-4', schoolId: 'sch-1', name: 'کلاس دوازدهم تجربی', gradeLevel: 12, academicYear: '1403-1404', track: 'علوم تجربی', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', studentCount: 22 },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'st-1',
    schoolId: 'sch-1',
    userId: 'u-4',
    name: 'علی کمالی',
    nationalCode: '0012345678',
    classId: 'c-1',
    className: 'کلاس دهم تجربی الف',
    gradeLevel: 10,
    academicYear: '1403-1404',
    status: 'ACTIVE',
    guardians: [
      { id: 'g-1', studentId: 'st-1', guardianName: 'محمد کمالی', guardianPhone: '09128889900', relationship: 'FATHER' }
    ]
  },
  {
    id: 'st-2',
    schoolId: 'sch-1',
    userId: 'u-st2',
    name: 'سارا احمدی',
    nationalCode: '0023456789',
    classId: 'c-1',
    className: 'کلاس دهم تجربی الف',
    gradeLevel: 10,
    academicYear: '1403-1404',
    status: 'ACTIVE',
    guardians: [
      { id: 'g-2', studentId: 'st-2', guardianName: 'مریم باقری', guardianPhone: '09124445566', relationship: 'MOTHER' }
    ]
  },
  {
    id: 'st-3',
    schoolId: 'sch-1',
    userId: 'u-st3',
    name: 'رضا حسینی',
    nationalCode: '0034567890',
    classId: 'c-1',
    className: 'کلاس دهم تجربی الف',
    gradeLevel: 10,
    academicYear: '1403-1404',
    status: 'ACTIVE',
    guardians: [
      { id: 'g-3', studentId: 'st-3', guardianName: 'امیر حسینی', guardianPhone: '09127778899', relationship: 'FATHER' }
    ]
  },
  {
    id: 'st-4',
    schoolId: 'sch-1',
    userId: 'u-st4',
    name: 'مریم کاظمی',
    nationalCode: '0045678901',
    classId: 'c-2',
    className: 'کلاس دهم ریاضی الف',
    gradeLevel: 10,
    academicYear: '1403-1404',
    status: 'ACTIVE',
    guardians: []
  },
  {
    id: 'st-5',
    schoolId: 'sch-1',
    userId: 'u-st5',
    name: 'امیرحسین رضوی',
    nationalCode: '0056789012',
    classId: 'c-4',
    className: 'کلاس دوازدهم تجربی',
    gradeLevel: 12,
    academicYear: '1403-1404',
    status: 'ACTIVE',
    guardians: []
  }
];

const INITIAL_GRADES: GradeItem[] = [
  { id: 'gr-1', schoolId: 'sch-1', studentId: 'st-1', studentName: 'علی کمالی', classId: 'c-1', courseId: 'cr-1', courseName: 'شیمی ۱', academicYear: '1403-1404', term: 'CONTINUOUS_1', score: 19.5, descriptive: 'EXCELLENT', updatedAt: '1403/08/15' },
  { id: 'gr-2', schoolId: 'sch-1', studentId: 'st-1', studentName: 'علی کمالی', classId: 'c-1', courseId: 'cr-2', courseName: 'زیست‌شناسی ۱', academicYear: '1403-1404', term: 'CONTINUOUS_1', score: 18.0, descriptive: 'VERY_GOOD', updatedAt: '1403/08/16' },
  { id: 'gr-3', schoolId: 'sch-1', studentId: 'st-1', studentName: 'علی کمالی', classId: 'c-1', courseId: 'cr-3', courseName: 'ریاضی ۱', academicYear: '1403-1404', term: 'CONTINUOUS_1', score: 17.5, descriptive: 'VERY_GOOD', updatedAt: '1403/08/18' },
  { id: 'gr-4', schoolId: 'sch-1', studentId: 'st-2', studentName: 'سارا احمدی', classId: 'c-1', courseId: 'cr-1', courseName: 'شیمی ۱', academicYear: '1403-1404', term: 'CONTINUOUS_1', score: 20.0, descriptive: 'EXCELLENT', updatedAt: '1403/08/15' },
  { id: 'gr-5', schoolId: 'sch-1', studentId: 'st-3', studentName: 'رضا حسینی', classId: 'c-1', courseId: 'cr-1', courseName: 'شیمی ۱', academicYear: '1403-1404', term: 'CONTINUOUS_1', score: 15.0, descriptive: 'GOOD', updatedAt: '1403/08/15' },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', schoolId: 'sch-1', classId: 'c-1', date: getTodayJalali(), studentId: 'st-1', studentName: 'علی کمالی', status: 'PRESENT' },
  { id: 'att-2', schoolId: 'sch-1', classId: 'c-1', date: getTodayJalali(), studentId: 'st-2', studentName: 'سارا احمدی', status: 'PRESENT' },
  { id: 'att-3', schoolId: 'sch-1', classId: 'c-1', date: getTodayJalali(), studentId: 'st-3', studentName: 'رضا حسینی', status: 'LATE', note: 'تاخیر ۱۵ دقیقه به دلیل ترافیک' },
  { id: 'att-4', schoolId: 'sch-1', classId: 'c-1', date: '1403/08/19', studentId: 'st-1', studentName: 'علی کمالی', status: 'PRESENT' },
  { id: 'att-5', schoolId: 'sch-1', classId: 'c-1', date: '1403/08/19', studentId: 'st-2', studentName: 'سارا احمدی', status: 'PRESENT' },
  { id: 'att-6', schoolId: 'sch-1', classId: 'c-1', date: '1403/08/19', studentId: 'st-3', studentName: 'رضا حسینی', status: 'EXCUSED', note: 'گواهی پزشکی ارائه شد' },
];

const INITIAL_EXCUSES: AbsenceExcuse[] = [
  { id: 'ex-1', schoolId: 'sch-1', studentId: 'st-3', studentName: 'رضا حسینی', date: '1403/08/19', reason: 'مراجعه به پزشک جهت سرماخوردگی شدید', status: 'APPROVED', adminComment: 'موافقت شد.' },
  { id: 'ex-2', schoolId: 'sch-1', studentId: 'st-1', studentName: 'علی کمالی', date: getTodayJalali(), reason: 'مسافرت ضروری خانوادگی به شهرستان', status: 'PENDING' },
];

const INITIAL_TIMETABLE: TimetableEntry[] = [
  { id: 'tt-1', schoolId: 'sch-1', classId: 'c-1', className: 'کلاس دهم تجربی الف', day: 0, period: 1, courseName: 'شیمی ۱', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', room: '۱۰۱' },
  { id: 'tt-2', schoolId: 'sch-1', classId: 'c-1', className: 'کلاس دهم تجربی الف', day: 0, period: 2, courseName: 'زیست‌شناسی ۱', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', room: '۱۰۱' },
  { id: 'tt-3', schoolId: 'sch-1', classId: 'c-1', className: 'کلاس دهم تجربی الف', day: 0, period: 3, courseName: 'فیزیک ۱', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', room: '۱۰۱' },
  { id: 'tt-4', schoolId: 'sch-1', classId: 'c-1', className: 'کلاس دهم تجربی الف', day: 1, period: 1, courseName: 'ریاضی ۱', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', room: '۱۰۱' },
  { id: 'tt-5', schoolId: 'sch-1', classId: 'c-1', className: 'کلاس دهم تجربی الف', day: 1, period: 2, courseName: 'زبان انگلیسی', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', room: '۱۰۱' },
  { id: 'tt-6', schoolId: 'sch-1', classId: 'c-2', className: 'کلاس دهم ریاضی الف', day: 0, period: 1, courseName: 'حسابان / ریاضی ۱', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', room: '۱۰۲' },
];

const INITIAL_TOPICS: CurriculumTopic[] = [
  { id: 'top-1', gradeLevel: 10, courseName: 'شیمی ۱', title: 'فصل ۱: کیهان زادگاه الفبای هستی', order: 1 },
  { id: 'top-2', gradeLevel: 10, courseName: 'شیمی ۱', title: 'فصل ۲: ردپای گازها در زندگی', order: 2 },
  { id: 'top-3', gradeLevel: 10, courseName: 'زیست‌شناسی ۱', title: 'فصل ۱: زیست‌شناسی، دیروز، امروز و فردا', order: 1 },
  { id: 'top-4', gradeLevel: 10, courseName: 'زیست‌شناسی ۱', title: 'فصل ۲: گوارش و جذب مواد', order: 2 },
  { id: 'top-5', gradeLevel: 10, courseName: 'ریاضی ۱', title: 'فصل ۱: مجموعه، الگو و دنباله', order: 1 },
];

const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: 'q-1',
    topicId: 'top-1',
    topicTitle: 'فصل ۱: کیهان زادگاه الفبای هستی',
    courseName: 'شیمی ۱',
    gradeLevel: 10,
    type: 'MULTIPLE_CHOICE',
    questionText: 'در ساختار اتم، کدام ذره بار الکتریکی ندارد و در هسته قرار دارد؟',
    difficulty: 'EASY',
    options: ['پروتون', 'نوترون', 'الکترون', 'پوزیترون'],
    correctOptionIndex: 1,
    explanation: 'نوترون‌ها ذرات خنثی و بدون بار الکتریکی هستند که به همراه پروتون‌ها هسته اتم را تشکیل می‌دهند.',
    authorName: 'استاد حمیدرضا رضایی'
  },
  {
    id: 'q-2',
    topicId: 'top-1',
    topicTitle: 'فصل ۱: کیهان زادگاه الفبای هستی',
    courseName: 'شیمی ۱',
    gradeLevel: 10,
    type: 'MULTIPLE_CHOICE',
    questionText: 'ایزوتوپ‌های یک عنصر در کدام ویژگی با یکدیگر یکسان هستند؟',
    difficulty: 'MEDIUM',
    options: ['عدد جرمی', 'تعداد نوترون‌ها', 'عدد اتمی (تعداد پروتون)', 'جرم اتمی میانگین'],
    correctOptionIndex: 2,
    explanation: 'ایزوتوپ‌ها اتم‌هایی از یک عنصر هستند که عدد اتمی (تعداد پروتون) یکسان ولی تعداد نوترون متفاوت دارند.',
    authorName: 'استاد حمیدرضا رضایی'
  },
  {
    id: 'q-3',
    topicId: 'top-4',
    topicTitle: 'فصل ۲: گوارش و جذب مواد',
    courseName: 'زیست‌شناسی ۱',
    gradeLevel: 10,
    type: 'MULTIPLE_CHOICE',
    questionText: 'آنزیم پپسین در کدام بخش از لوله گوارش انسان ترشح و فعال می‌شود؟',
    difficulty: 'EASY',
    options: ['دهان', 'معده', 'دوازدهه', 'روده باریک'],
    correctOptionIndex: 1,
    explanation: 'پپسینوژن توسط یاخته‌های اصلی معده ترشح شده و با اسید کلریدریک به پپسین فعال تبدیل می‌شود.',
    authorName: 'استاد حمیدرضا رضایی'
  },
  {
    id: 'q-4',
    topicId: 'top-5',
    topicTitle: 'فصل ۱: مجموعه، الگو و دنباله',
    courseName: 'ریاضی ۱',
    gradeLevel: 10,
    type: 'MULTIPLE_CHOICE',
    questionText: 'جمله عمومی یک دنباله حسابی به صورت an = 3n + 2 است. قدرنسبت این دنباله چقدر است؟',
    difficulty: 'EASY',
    options: ['۲', '۳', '۵', '۱'],
    correctOptionIndex: 1,
    explanation: 'در دنباله‌های حسابی به فرم an = d*n + c، ضریب n همان قدرنسبت دنباله یعنی ۳ می‌باشد.',
    authorName: 'استاد حمیدرضا رضایی'
  }
];

const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exm-1',
    schoolId: 'sch-1',
    title: 'آزمون میان‌ترم شیمی ۱ - پاییز ۱۴۰۳',
    courseName: 'شیمی ۱',
    gradeLevel: 10,
    durationMinutes: 20,
    totalPoints: 20,
    passScore: 10,
    startDate: '1403/08/01',
    endDate: '1403/09/30',
    status: 'ACTIVE',
    questions: [
      { id: 'eq-1', questionId: 'q-1', points: 10, order: 1 },
      { id: 'eq-2', questionId: 'q-2', points: 10, order: 2 },
    ],
    assignedClassIds: ['c-1', 'c-2']
  },
  {
    id: 'exm-2',
    schoolId: 'sch-1',
    title: 'کوییز زیست‌شناسی گوارش و جذب',
    courseName: 'زیست‌شناسی ۱',
    gradeLevel: 10,
    durationMinutes: 15,
    totalPoints: 20,
    passScore: 12,
    startDate: '1403/08/10',
    endDate: '1403/09/30',
    status: 'ACTIVE',
    questions: [
      { id: 'eq-3', questionId: 'q-3', points: 20, order: 1 }
    ],
    assignedClassIds: ['c-1']
  }
];

const INITIAL_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'att-ex-1',
    examId: 'exm-2',
    studentId: 'st-1',
    studentName: 'علی کمالی',
    startedAt: '1403/08/12 10:00',
    completedAt: '1403/08/12 10:11',
    answers: { 'q-3': 1 },
    score: 20,
    totalPossibleScore: 20,
    passed: true
  }
];

const INITIAL_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'sp-1',
    schoolId: 'sch-1',
    title: 'برنامه مطالعاتی هفتگی دهم تجربی - هفته سوم آبان',
    gradeLevel: 10,
    weekNumber: 3,
    assignedStudentIds: ['st-1', 'st-2', 'st-3'],
    intervals: [
      { id: 'it-1', planId: 'sp-1', dayOfWeek: 0, startTime: '16:00', durationMinutes: 90, courseName: 'شیمی ۱', topicTitle: 'حل تمارین ایزوتوپ‌ها و جرم اتمی', completed: true },
      { id: 'it-2', planId: 'sp-1', dayOfWeek: 0, startTime: '18:00', durationMinutes: 60, courseName: 'ریاضی ۱', topicTitle: 'دنباله‌های حسابی و هندسی', completed: true },
      { id: 'it-3', planId: 'sp-1', dayOfWeek: 1, startTime: '16:00', durationMinutes: 90, courseName: 'زیست‌شناسی ۱', topicTitle: 'یاخته‌های بافت جانوری و گوارش', completed: false },
      { id: 'it-4', planId: 'sp-1', dayOfWeek: 1, startTime: '18:00', durationMinutes: 60, courseName: 'فیزیک ۱', topicTitle: 'اندازه‌گیری و دقت وسیله', completed: false },
      { id: 'it-5', planId: 'sp-1', dayOfWeek: 2, startTime: '16:30', durationMinutes: 90, courseName: 'شیمی ۱', topicTitle: 'مطالعه جدول تناوبی عناصر', completed: false },
    ]
  }
];

const INITIAL_INVOICES: StudentInvoice[] = [
  {
    id: 'inv-1',
    schoolId: 'sch-1',
    studentId: 'st-1',
    studentName: 'علی کمالی',
    academicYear: '1403-1404',
    totalAmount: 240000000, // 24 million toman in rials
    discountAmount: 20000000, // 2 million toman discount
    paidAmount: 110000000,
    installments: [
      { id: 'ins-1', invoiceId: 'inv-1', installmentNumber: 1, dueDate: '1403/07/15', amount: 55000000, paidAmount: 55000000, status: 'PAID' },
      { id: 'ins-2', invoiceId: 'inv-1', installmentNumber: 2, dueDate: '1403/09/15', amount: 55000000, paidAmount: 55000000, status: 'PAID' },
      { id: 'ins-3', invoiceId: 'inv-1', installmentNumber: 3, dueDate: '1403/11/15', amount: 55000000, paidAmount: 0, status: 'PENDING' },
      { id: 'ins-4', invoiceId: 'inv-1', installmentNumber: 4, dueDate: '1404/02/15', amount: 55000000, paidAmount: 0, status: 'PENDING' },
    ]
  },
  {
    id: 'inv-2',
    schoolId: 'sch-1',
    studentId: 'st-2',
    studentName: 'سارا احمدی',
    academicYear: '1403-1404',
    totalAmount: 240000000,
    discountAmount: 0,
    paidAmount: 120000000,
    installments: [
      { id: 'ins-21', invoiceId: 'inv-2', installmentNumber: 1, dueDate: '1403/07/15', amount: 60000000, paidAmount: 60000000, status: 'PAID' },
      { id: 'ins-22', invoiceId: 'inv-2', installmentNumber: 2, dueDate: '1403/09/15', amount: 60000000, paidAmount: 60000000, status: 'PAID' },
      { id: 'ins-23', invoiceId: 'inv-2', installmentNumber: 3, dueDate: '1403/11/15', amount: 60000000, paidAmount: 0, status: 'PENDING' },
      { id: 'ins-24', invoiceId: 'inv-2', installmentNumber: 4, dueDate: '1404/02/15', amount: 60000000, paidAmount: 0, status: 'PENDING' },
    ]
  }
];

const INITIAL_RECEIPTS: PaymentReceipt[] = [
  { id: 'rec-1', invoiceId: 'inv-1', installmentId: 'ins-1', amount: 55000000, date: '1403/07/10', referenceNumber: 'TX-984321', method: 'BANK_TRANSFER', note: 'واریز فیش نقدی بانک ملی' },
  { id: 'rec-2', invoiceId: 'inv-1', installmentId: 'ins-2', amount: 55000000, date: '1403/09/12', referenceNumber: 'TX-990145', method: 'CARD', note: 'پرداخت با کارتخوان مدرسه' },
];

const INITIAL_EXPENSES: SchoolExpense[] = [
  { id: 'exp-1', schoolId: 'sch-1', category: 'تجهیزات و آزمایشگاه', vendor: 'شرکت کیمیا پژوهش', amount: 48000000, date: '1403/07/20', description: 'خرید مواد شیمیایی و لوله‌های آزمایشگاه علوم' },
  { id: 'exp-2', schoolId: 'sch-1', category: 'فناوری و اینترنت', vendor: 'آسیاتک', amount: 12500000, date: '1403/08/01', description: 'اشتراک سالانه فیبر نوری مدرسه' },
  { id: 'exp-3', schoolId: 'sch-1', category: 'چاپ و تکثیر', vendor: 'چاپخانه دانش', amount: 8400000, date: '1403/08/10', description: 'چاپ کاربرگ‌های هفتگی و آزمون‌ها' },
];

const INITIAL_EVENTS: SchoolEvent[] = [
  { id: 'ev-1', schoolId: 'sch-1', title: 'جلسه دیدار اولیا و مربیان نیم‌سال اول', date: '1403/08/25', category: 'MEETING', academicYear: '1403-1404', description: 'بررسی وضعیت تحصیلی و انضباطی دانش‌آموزان در سالن آمفی‌تئاتر', reminderRoles: ['PARENT', 'TEACHER'] },
  { id: 'ev-2', schoolId: 'sch-1', title: 'آغاز امتحانات نوبت اول', date: '1403/10/01', category: 'EXAM', academicYear: '1403-1404', description: 'شروع امتحانات دی‌ماه طبق برنامه تفصیلی', reminderRoles: ['STUDENT', 'PARENT', 'TEACHER'] },
  { id: 'ev-3', schoolId: 'sch-1', title: 'جشن ولادت و اردوی علمی فرهنگسرای رازی', date: '1403/09/15', category: 'ACTIVITY', academicYear: '1403-1404', description: 'اردوی تفریحی یک‌روزه برای پایه‌های دهم و یازدهم', reminderRoles: ['STUDENT', 'PARENT'] },
];

const INITIAL_QUESTION_BOX: QuestionBoxItem[] = [
  { id: 'qb-1', schoolId: 'sch-1', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', title: 'موازنه واکنش اکسایش پروپان', courseName: 'شیمی ۱', type: 'ESSAY', text: 'معادله واکنش کامل سوختن پروپان در اکسیژن را بنویسید و به روش وارسی موازنه کنید. مجموع ضرایب استوکیومتری چقدر است؟', score: 3.5, createdAt: '1403/08/15' },
  { id: 'qb-2', schoolId: 'sch-1', teacherId: 'u-2', teacherName: 'استاد حمیدرضا رضایی', title: 'تعریف ایزوتوپ و کاربرد پرتوزاها', courseName: 'شیمی ۱', type: 'ESSAY', text: 'دو ویژگی اصلی ایزوتوپ‌های پرتوزا و کاربرد تکنسیم-۹۹ را در پزشکی توضیح دهید.', score: 2.0, createdAt: '1403/08/18' },
];

const INITIAL_QUESTION_SHEETS: QuestionSheet[] = [
  {
    id: 'qs-1',
    schoolId: 'sch-1',
    title: 'برگه آزمون آزمایشی شیمی دهم',
    headerDetails: {
      schoolName: 'دبیرستان هوشمند رشدِ اندیشه',
      courseName: 'شیمی ۱',
      gradeTitle: 'دهم علوم تجربی',
      date: '1403/08/20',
      durationMinutes: 45,
      teacherName: 'استاد حمیدرضا رضایی'
    },
    questions: [
      { text: 'در ساختار اتم، کدام ذره بار الکتریکی ندارد و در هسته قرار دارد؟', type: 'MULTIPLE_CHOICE', score: 2.5, options: ['پروتون', 'نوترون', 'الکترون', 'پوزیترون'] },
      { text: 'معادله واکنش کامل سوختن پروپان در اکسیژن را بنویسید و به روش وارسی موازنه کنید.', type: 'ESSAY', score: 3.5 },
    ]
  }
];

const INITIAL_ROLES: SchoolRole[] = [
  { id: 'r-1', code: 'SCHOOL_ADMIN', name: 'مدیر کل مدرسه', description: 'دسترسی کامل به تمام بخش‌ها، کلاس‌ها، کاربران، مالی و تنظیمات', system: true, permissions: ['ALL_PERMISSIONS'] },
  { id: 'r-2', code: 'TEACHER', name: 'دبیر و آموزگار', description: 'ثبت نمرات، حضور و غیاب، طراحی آزمون و بانک سؤالات', system: true, permissions: ['CLASS_VIEW', 'GRADE_MANAGE', 'ATTENDANCE_MANAGE', 'EXAM_MANAGE'] },
  { id: 'r-3', code: 'FINANCE_ADMIN', name: 'مسئول مالی و شهریه', description: 'مدیریت صورتحساب‌ها، اقساط، دریافت‌ها و ثبت هزینه‌ها', system: true, permissions: ['FINANCE_MANAGE', 'EXPENSES_MANAGE'] },
  { id: 'r-4', code: 'STUDENT', name: 'دانش‌آموز', description: 'مشاهده کارنامه، شرکت در آزمون، برنامه درسی و حضور و غیاب شخصی', system: true, permissions: ['PORTAL_STUDENT'] },
  { id: 'r-5', code: 'PARENT', name: 'ولی / سرپرست دانش‌آموز', description: 'مشاهده وضعیت انضباطی، مالی و نمرات فرزندان لینک‌شده', system: true, permissions: ['PORTAL_PARENT'] },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helpers
  const getStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(`roshdeandishe_${key}`);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('currentUser', INITIAL_USERS[0]));
  const [currentRole, setCurrentRole] = useState<UserRole>(() => getStored('currentRole', 'SCHOOL_ADMIN'));
  const [schools, setSchools] = useState<School[]>(() => getStored('schools', INITIAL_SCHOOLS));
  const [currentSchoolId, setCurrentSchoolId] = useState<string>(() => getStored('currentSchoolId', 'sch-1'));
  
  const [memberships, setMemberships] = useState<SchoolMembership[]>(() => getStored('memberships', INITIAL_MEMBERSHIPS));
  const [classes, setClasses] = useState<AcademicClass[]>(() => getStored('classes', INITIAL_CLASSES));
  const [students, setStudents] = useState<Student[]>(() => getStored('students', INITIAL_STUDENTS));
  const [grades, setGrades] = useState<GradeItem[]>(() => getStored('grades', INITIAL_GRADES));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStored('attendance', INITIAL_ATTENDANCE));
  const [excuses, setExcuses] = useState<AbsenceExcuse[]>(() => getStored('excuses', INITIAL_EXCUSES));
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => getStored('timetable', INITIAL_TIMETABLE));
  const [topics, setTopics] = useState<CurriculumTopic[]>(() => getStored('topics', INITIAL_TOPICS));
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(() => getStored('questionBank', INITIAL_QUESTIONS));
  const [exams, setExams] = useState<Exam[]>(() => getStored('exams', INITIAL_EXAMS));
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => getStored('examAttempts', INITIAL_ATTEMPTS));
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(() => getStored('studyPlans', INITIAL_STUDY_PLANS));
  const [invoices, setInvoices] = useState<StudentInvoice[]>(() => getStored('invoices', INITIAL_INVOICES));
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => getStored('receipts', INITIAL_RECEIPTS));
  const [expenses, setExpenses] = useState<SchoolExpense[]>(() => getStored('expenses', INITIAL_EXPENSES));
  const [events, setEvents] = useState<SchoolEvent[]>(() => getStored('events', INITIAL_EVENTS));
  const [questionBoxItems, setQuestionBoxItems] = useState<QuestionBoxItem[]>(() => getStored('questionBoxItems', INITIAL_QUESTION_BOX));
  const [questionSheets, setQuestionSheets] = useState<QuestionSheet[]>(() => getStored('questionSheets', INITIAL_QUESTION_SHEETS));
  const [roles, setRoles] = useState<SchoolRole[]>(() => getStored('roles', INITIAL_ROLES));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roshdeandishe_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_currentRole', JSON.stringify(currentRole));
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_currentSchoolId', JSON.stringify(currentSchoolId));
  }, [currentSchoolId]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('roshdeandishe_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const currentSchool = schools.find(s => s.id === currentSchoolId) || schools[0] || null;

  const login = (email: string) => {
    const user = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      setCurrentUser(user);
      // Auto assign role based on user
      const membership = memberships.find(m => m.userId === user.id && m.schoolId === currentSchoolId);
      if (membership) {
        setCurrentRole(membership.role);
      } else if (user.email.includes('admin')) {
        setCurrentRole('SCHOOL_ADMIN');
      } else if (user.email.includes('rezaei')) {
        setCurrentRole('TEACHER');
      } else if (user.email.includes('ali.kamali')) {
        setCurrentRole('STUDENT');
      } else if (user.email.includes('parent')) {
        setCurrentRole('PARENT');
      }
      return true;
    }
    // Generic login for demo
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      phone: '09120000000',
      hasPassword: true,
      active: true
    };
    setCurrentUser(newUser);
    setCurrentRole('SCHOOL_ADMIN');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createSchool = (newSchoolData: Partial<School>): School => {
    const newSchool: School = {
      id: `sch-${Date.now()}`,
      name: newSchoolData.name || 'مدرسه جدید',
      slug: newSchoolData.slug || `school-${Date.now().toString(36)}`,
      level: newSchoolData.level || 'UPPER_SECONDARY',
      levelTitle: newSchoolData.level === 'ELEMENTARY' ? 'دبستان' : newSchoolData.level === 'LOWER_SECONDARY' ? 'متوسطه اول' : 'متوسطه دوم',
      currentAcademicYear: '1403-1404',
      weekStart: newSchoolData.weekStart || 'SATURDAY',
      timezone: 'Asia/Tehran',
      locale: 'fa-IR',
      address: newSchoolData.address || '',
      phone: newSchoolData.phone || '',
      activeModules: ['ACADEMIC', 'FINANCE', 'ATTENDANCE'],
      baleBotEnabled: false,
      autoPromotionEnabled: false,
      installmentsCount: 4,
    };
    setSchools(prev => [...prev, newSchool]);
    setCurrentSchoolId(newSchool.id);
    if (currentUser) {
      const newMembership: SchoolMembership = {
        id: `m-${Date.now()}`,
        schoolId: newSchool.id,
        userId: currentUser.id,
        user: currentUser,
        role: 'SCHOOL_ADMIN',
        roleTitle: 'مدیر کل مدرسه',
        active: true,
        createdAt: getTodayJalali()
      };
      setMemberships(prev => [...prev, newMembership]);
      setCurrentRole('SCHOOL_ADMIN');
    }
    return newSchool;
  };

  const updateSchoolSettings = (settings: Partial<School>) => {
    if (!currentSchool) return;
    setSchools(prev => prev.map(s => s.id === currentSchool.id ? { ...s, ...settings } : s));
  };

  const addMember = (name: string, email: string, phone: string, role: UserRole) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      phone,
      hasPassword: false,
      active: true
    };
    const roleTitleMap: Record<UserRole, string> = {
      SCHOOL_ADMIN: 'مدیر مدرسه',
      TEACHER: 'دبیر',
      FINANCE_ADMIN: 'مدیر مالی',
      STUDENT: 'دانش‌آموز',
      PARENT: 'ولی دانش‌آموز',
      CUSTOM: 'نقش سفارشی'
    };
    const newMem: SchoolMembership = {
      id: `m-${Date.now()}`,
      schoolId: currentSchoolId,
      userId: newUser.id,
      user: newUser,
      role,
      roleTitle: roleTitleMap[role] || 'کاربر',
      active: true,
      createdAt: getTodayJalali()
    };
    setMemberships(prev => [...prev, newMem]);
  };

  const toggleMemberActive = (id: string) => {
    setMemberships(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const createCustomRole = (name: string, description: string, permissions: string[]) => {
    const newRole: SchoolRole = {
      id: `r-${Date.now()}`,
      code: `ROLE_CUSTOM_${Date.now()}`,
      name,
      description,
      system: false,
      permissions
    };
    setRoles(prev => [...prev, newRole]);
  };

  const addClass = (name: string, gradeLevel: number, track: string, teacherId?: string) => {
    const teacher = memberships.find(m => m.userId === teacherId)?.user;
    const newClass: AcademicClass = {
      id: `c-${Date.now()}`,
      schoolId: currentSchoolId,
      name,
      gradeLevel,
      academicYear: currentSchool?.currentAcademicYear || '1403-1404',
      track,
      teacherId,
      teacherName: teacher ? teacher.name : undefined,
      studentCount: 0
    };
    setClasses(prev => [...prev, newClass]);
  };

  const addStudent = (name: string, nationalCode: string, classId: string, guardianName?: string, guardianPhone?: string) => {
    const targetClass = classes.find(c => c.id === classId);
    const newStudentId = `st-${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      schoolId: currentSchoolId,
      userId: `u-st-${Date.now()}`,
      name,
      nationalCode,
      classId,
      className: targetClass?.name || 'کلاس نامشخص',
      gradeLevel: targetClass?.gradeLevel || 10,
      academicYear: currentSchool?.currentAcademicYear || '1403-1404',
      status: 'ACTIVE',
      guardians: guardianName ? [{
        id: `g-${Date.now()}`,
        studentId: newStudentId,
        guardianName,
        guardianPhone: guardianPhone || '',
        relationship: 'FATHER'
      }] : []
    };
    setStudents(prev => [...prev, newStudent]);
    // Increment class student count
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, studentCount: c.studentCount + 1 } : c));
  };

  const saveGrade = (gradeData: Omit<GradeItem, 'id' | 'updatedAt'>) => {
    setGrades(prev => {
      const idx = prev.findIndex(g =>
        g.studentId === gradeData.studentId &&
        g.courseId === gradeData.courseId &&
        g.term === gradeData.term &&
        g.academicYear === gradeData.academicYear
      );
      const updated: GradeItem = {
        ...gradeData,
        id: idx >= 0 ? prev[idx].id : `gr-${Date.now()}`,
        updatedAt: getTodayJalali()
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const saveAttendanceRoll = (records: Omit<AttendanceRecord, 'id'>[]) => {
    setAttendance(prev => {
      const copy = [...prev];
      for (const rec of records) {
        const existingIdx = copy.findIndex(a =>
          a.classId === rec.classId &&
          a.date === rec.date &&
          a.studentId === rec.studentId
        );
        if (existingIdx >= 0) {
          copy[existingIdx] = { ...rec, id: copy[existingIdx].id };
        } else {
          copy.push({ ...rec, id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` });
        }
      }
      return copy;
    });
  };

  const submitExcuse = (studentId: string, date: string, reason: string) => {
    const student = students.find(s => s.id === studentId);
    const newExcuse: AbsenceExcuse = {
      id: `ex-${Date.now()}`,
      schoolId: currentSchoolId,
      studentId,
      studentName: student?.name || 'دانش‌آموز',
      date,
      reason,
      status: 'PENDING'
    };
    setExcuses(prev => [newExcuse, ...prev]);
  };

  const decideExcuse = (id: string, status: 'APPROVED' | 'REJECTED', adminComment?: string) => {
    setExcuses(prev => prev.map(e => {
      if (e.id === id) {
        if (status === 'APPROVED') {
          // Also mark attendance as EXCUSED
          setAttendance(att => att.map(a => (a.studentId === e.studentId && a.date === e.date) ? { ...a, status: 'EXCUSED' } : a));
        }
        return { ...e, status, adminComment };
      }
      return e;
    }));
  };

  const saveTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    setTimetable(prev => {
      const filtered = prev.filter(t => !(t.classId === entry.classId && t.day === entry.day && t.period === entry.period));
      return [...filtered, { ...entry, id: `tt-${Date.now()}` }];
    });
  };

  const removeTimetableEntry = (id: string) => {
    setTimetable(prev => prev.filter(t => t.id !== id));
  };

  const addTopic = (title: string, courseName: string, gradeLevel: number) => {
    const newTopic: CurriculumTopic = {
      id: `top-${Date.now()}`,
      title,
      courseName,
      gradeLevel,
      order: topics.length + 1
    };
    setTopics(prev => [...prev, newTopic]);
  };

  const addQuestion = (q: Omit<QuestionBankItem, 'id'>) => {
    setQuestionBank(prev => [{ ...q, id: `q-${Date.now()}` }, ...prev]);
  };

  const createExam = (exam: Omit<Exam, 'id' | 'questions'>, questionIds: string[]) => {
    const newExam: Exam = {
      ...exam,
      id: `exm-${Date.now()}`,
      questions: questionIds.map((qid, idx) => ({
        id: `eq-${Date.now()}-${idx}`,
        questionId: qid,
        points: Math.round(exam.totalPoints / Math.max(1, questionIds.length)),
        order: idx + 1
      }))
    };
    setExams(prev => [newExam, ...prev]);
  };

  const submitExamAttempt = (attemptData: Omit<ExamAttempt, 'id' | 'completedAt'>): ExamAttempt => {
    const exam = exams.find(e => e.id === attemptData.examId);
    let score = 0;
    if (exam) {
      exam.questions.forEach(eq => {
        const question = questionBank.find(q => q.id === eq.questionId);
        if (question && question.type === 'MULTIPLE_CHOICE' && question.correctOptionIndex !== undefined) {
          const userAns = attemptData.answers[eq.questionId];
          if (userAns !== undefined && Number(userAns) === question.correctOptionIndex) {
            score += eq.points;
          }
        }
      });
    }
    const completedAttempt: ExamAttempt = {
      ...attemptData,
      id: `att-ex-${Date.now()}`,
      completedAt: getTodayJalali(),
      score,
      passed: score >= (exam?.passScore || 10)
    };
    setExamAttempts(prev => [completedAttempt, ...prev]);
    return completedAttempt;
  };

  const toggleIntervalCompleted = (planId: string, intervalId: string) => {
    setStudyPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          intervals: p.intervals.map(it => it.id === intervalId ? { ...it, completed: !it.completed } : it)
        };
      }
      return p;
    }));
  };

  const createStudyPlan = (plan: Omit<StudyPlan, 'id'>) => {
    setStudyPlans(prev => [{ ...plan, id: `sp-${Date.now()}` }, ...prev]);
  };

  const setSchoolTuition = (amount: number, installmentsCount: number) => {
    updateSchoolSettings({ installmentsCount });
    // Update or generate invoices for current academic year students
    setInvoices(prev => {
      const year = currentSchool?.currentAcademicYear || '1403-1404';
      const updated = [...prev];
      students.forEach(st => {
        const existingIdx = updated.findIndex(inv => inv.studentId === st.id && inv.academicYear === year);
        const installmentAmount = Math.round(amount / Math.max(1, installmentsCount));
        const newInstallments = Array.from({ length: installmentsCount }, (_, i) => ({
          id: `ins-${st.id}-${i + 1}`,
          invoiceId: existingIdx >= 0 ? updated[existingIdx].id : `inv-${st.id}`,
          installmentNumber: i + 1,
          dueDate: `1403/${String((i * 2) + 7).padStart(2, '0')}/15`,
          amount: installmentAmount,
          paidAmount: 0,
          status: 'PENDING' as const
        }));

        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            totalAmount: amount,
            installments: newInstallments
          };
        } else {
          updated.push({
            id: `inv-${st.id}`,
            schoolId: currentSchoolId,
            studentId: st.id,
            studentName: st.name,
            academicYear: year,
            totalAmount: amount,
            discountAmount: 0,
            paidAmount: 0,
            installments: newInstallments
          });
        }
      });
      return updated;
    });
  };

  const recordPayment = (invoiceId: string, amount: number, refNum: string, method: 'CARD' | 'BANK_TRANSFER' | 'CASH', note?: string) => {
    const receipt: PaymentReceipt = {
      id: `rec-${Date.now()}`,
      invoiceId,
      amount,
      date: getTodayJalali(),
      referenceNumber: refNum,
      method,
      note
    };
    setReceipts(prev => [receipt, ...prev]);

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + amount;
        let remainingToApply = amount;
        const updatedIns = inv.installments.map(ins => {
          if (remainingToApply <= 0) return ins;
          const dueForThis = ins.amount - ins.paidAmount;
          if (dueForThis <= 0) return ins;
          const toPay = Math.min(remainingToApply, dueForThis);
          remainingToApply -= toPay;
          const updatedPaid = ins.paidAmount + toPay;
          return {
            ...ins,
            paidAmount: updatedPaid,
            status: updatedPaid >= ins.amount ? 'PAID' as const : 'PARTIAL' as const
          };
        });
        return {
          ...inv,
          paidAmount: newPaid,
          installments: updatedIns
        };
      }
      return inv;
    }));
  };

  const applyDiscount = (invoiceId: string, discountAmount: number) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, discountAmount };
      }
      return inv;
    }));
  };

  const addExpense = (expense: Omit<SchoolExpense, 'id'>) => {
    setExpenses(prev => [{ ...expense, id: `exp-${Date.now()}` }, ...prev]);
  };

  const addEvent = (event: Omit<SchoolEvent, 'id'>) => {
    setEvents(prev => [{ ...event, id: `ev-${Date.now()}` }, ...prev]);
  };

  const addQuestionBoxItem = (item: Omit<QuestionBoxItem, 'id' | 'createdAt'>) => {
    setQuestionBoxItems(prev => [{ ...item, id: `qb-${Date.now()}`, createdAt: getTodayJalali() }, ...prev]);
  };

  const createQuestionSheet = (sheet: Omit<QuestionSheet, 'id'>) => {
    setQuestionSheets(prev => [{ ...sheet, id: `qs-${Date.now()}` }, ...prev]);
  };

  const runPromotion = () => {
    let promoted = 0;
    let graduated = 0;
    setStudents(prev => prev.map(st => {
      if (st.gradeLevel >= 12) {
        graduated++;
        return { ...st, status: 'GRADUATED' };
      } else {
        promoted++;
        return { ...st, gradeLevel: st.gradeLevel + 1 };
      }
    }));
    return { promotedCount: promoted, graduatedCount: graduated };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentSchool,
        currentRole,
        schools,
        memberships,
        classes,
        students,
        grades,
        attendance,
        excuses,
        timetable,
        topics,
        questionBank,
        exams,
        examAttempts,
        studyPlans,
        invoices,
        receipts,
        expenses,
        events,
        questionBoxItems,
        questionSheets,
        roles,
        login,
        logout,
        setCurrentSchoolId,
        setCurrentRole,
        createSchool,
        updateSchoolSettings,
        addMember,
        toggleMemberActive,
        createCustomRole,
        addClass,
        addStudent,
        saveGrade,
        saveAttendanceRoll,
        submitExcuse,
        decideExcuse,
        saveTimetableEntry,
        removeTimetableEntry,
        addTopic,
        addQuestion,
        createExam,
        submitExamAttempt,
        toggleIntervalCompleted,
        createStudyPlan,
        setSchoolTuition,
        recordPayment,
        applyDiscount,
        addExpense,
        addEvent,
        addQuestionBoxItem,
        createQuestionSheet,
        runPromotion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
