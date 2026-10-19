import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  BookOpen,
  Award,
  CalendarCheck,
  CreditCard,
  FileCheck2,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { toPersianDigits, formatToman, getTodayJalali } from '../utils/jalali';

interface DashboardViewProps {
  onNavigate: (page: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentSchool,
    currentRole,
    classes,
    students,
    grades,
    attendance,
    exams,
    invoices,
    events,
    timetable,
    studyPlans
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [checklistDismissed, setChecklistDismissed] = useState(false);

  const isAdmin = currentRole === 'SCHOOL_ADMIN';
  const isTeacher = currentRole === 'TEACHER';
  const isParent = currentRole === 'PARENT';
  const isStudent = currentRole === 'STUDENT';
  const isFinance = currentRole === 'FINANCE_ADMIN';

  // Copy school slug link
  const schoolLink = `${window.location.origin}/s/${currentSchool?.slug || 'school'}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(schoolLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Setup checklist calculation for admin
  const hasTeacher = true; // Seed data has teacher
  const hasClasses = classes.length > 0;
  const hasStudents = students.length > 0;
  const checklistCompleted = hasTeacher && hasClasses && hasStudents;
  const completedStepsCount = (hasTeacher ? 1 : 0) + (hasClasses ? 1 : 0) + (hasStudents ? 1 : 0);

  // Today attendance stats
  const todayDate = getTodayJalali();
  const todayRecords = attendance.filter(a => a.date === todayDate);
  const presentCount = todayRecords.filter(a => a.status === 'PRESENT').length;
  const absentCount = todayRecords.filter(a => a.status === 'ABSENT' || a.status === 'EXCUSED').length;
  const lateCount = todayRecords.filter(a => a.status === 'LATE').length;

  // Finance stats
  const totalTuition = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const collectionRate = totalTuition > 0 ? Math.round((totalCollected / totalTuition) * 100) : 0;

  // Student specific stats (e.g. Ali Kamali)
  const currentStudent = students.find(s => s.userId === currentUser?.id) || students[0];
  const myGrades = grades.filter(g => g.studentId === currentStudent?.id);
  const myExams = exams.filter(e => e.status === 'ACTIVE');
  const myAttendance = attendance.filter(a => a.studentId === currentStudent?.id);
  const myAbsentCount = myAttendance.filter(a => a.status === 'ABSENT').length;
  const myExcusedCount = myAttendance.filter(a => a.status === 'EXCUSED').length;
  const myLateCount = myAttendance.filter(a => a.status === 'LATE').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-teal-800 to-teal-600 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100 text-xs font-medium mb-2 backdrop-blur-xs">
            <span>امروز: {toPersianDigits(todayDate)}</span>
            <span>•</span>
            <span>سال تحصیلی {toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            سلام، {currentUser?.name} عزیز 👋
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm mt-1">
            شما با دسترسی <strong className="text-white underline decoration-teal-400">{
              isAdmin ? 'مدیر کل مدرسه' : isTeacher ? 'دبیر / آموزگار' : isFinance ? 'مدیر مالی' : isStudent ? 'دانش‌آموز' : 'ولی دانش‌آموز'
            }</strong> در <span className="font-semibold">{currentSchool?.name}</span> هستید.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onNavigate('settings')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition"
            >
              تنظیمات مدرسه
            </button>
          )}
          <button
            onClick={() => onNavigate(isStudent || isParent ? 'my_grades' : isTeacher ? 'grades' : 'classes')}
            className="px-4 py-2 rounded-xl bg-white text-teal-800 hover:bg-teal-50 text-xs font-semibold shadow-sm transition"
          >
            ورود سریع به کارنامه و کلاس‌ها
          </button>
        </div>
      </div>

      {/* Admin Setup Checklist */}
      {isAdmin && !checklistCompleted && !checklistDismissed && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-amber-900 text-sm sm:text-base">
                مراحل راه‌اندازی {currentSchool?.name} ({toPersianDigits(completedStepsCount)} از ۳)
              </h2>
            </div>
            <button
              onClick={() => setChecklistDismissed(true)}
              className="text-xs text-amber-700 hover:text-amber-900 underline"
            >
              پنهان کردن
            </button>
          </div>

          <div className="w-full bg-amber-200 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedStepsCount / 3) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('people')}
              className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
                hasTeacher ? 'bg-white border-teal-200 text-teal-800' : 'bg-white/80 border-amber-200 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">۱. افزودن دبیران</span>
                <span className="text-[11px] text-slate-500">معلمان و کادر مدرسه</span>
              </div>
              {hasTeacher ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <ChevronRight className="w-4 h-4 text-amber-500" />}
            </button>

            <button
              onClick={() => onNavigate('classes')}
              className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
                hasClasses ? 'bg-white border-teal-200 text-teal-800' : 'bg-white/80 border-amber-200 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">۲. تعریف کلاس‌ها</span>
                <span className="text-[11px] text-slate-500">پایه‌ها و رشته‌های تحصیلی</span>
              </div>
              {hasClasses ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <ChevronRight className="w-4 h-4 text-amber-500" />}
            </button>

            <button
              onClick={() => onNavigate('students')}
              className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
                hasStudents ? 'bg-white border-teal-200 text-teal-800' : 'bg-white/80 border-amber-200 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">۳. ثبت‌نام دانش‌آموزان</span>
                <span className="text-[11px] text-slate-500">تخصیص به کلاس و اولیا</span>
              </div>
              {hasStudents ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <ChevronRight className="w-4 h-4 text-amber-500" />}
            </button>
          </div>
        </div>
      )}

      {/* Role specific view: STUDENT or PARENT */}
      {(isStudent || isParent) && (
        <div className="space-y-6">
          {/* Summary Card for Student/Child */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-sm sm:text-base">
                    {isParent ? `خلاصه وضعیت تحصیلی: ${currentStudent?.name}` : 'خلاصه وضعیت من'}
                  </h2>
                  <span className="text-xs text-slate-400">
                    پایه {toPersianDigits(currentStudent?.gradeLevel || 10)} • {currentStudent?.className}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('my_grades')}
                className="text-xs text-teal-600 hover:text-teal-800 font-medium"
              >
                مشاهده کارنامه کامل
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Latest Grades */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 block mb-2">آخرین نمرات ثبت شده</span>
                <div className="space-y-1.5">
                  {myGrades.slice(0, 3).map(g => (
                    <div key={g.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700">{g.courseName}</span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {toPersianDigits(g.score ?? 0)}
                      </span>
                    </div>
                  ))}
                  {myGrades.length === 0 && (
                    <span className="text-xs text-slate-400">هنوز نمره‌ای ثبت نشده است</span>
                  )}
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 block mb-2">وضعیت انضباطی سال جاری</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-red-50 text-red-700 border border-red-100">
                    <span className="text-base font-bold block">{toPersianDigits(myAbsentCount)}</span>
                    <span className="text-[10px]">غیبت غیرموجه</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                    <span className="text-base font-bold block">{toPersianDigits(myExcusedCount)}</span>
                    <span className="text-[10px]">غیبت موجه</span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    <span className="text-base font-bold block">{toPersianDigits(myLateCount)}</span>
                    <span className="text-[10px]">تأخیر ورود</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 block mb-2">آزمون‌های پیش‌رو</span>
                <div className="space-y-1.5">
                  {myExams.slice(0, 2).map(e => (
                    <div key={e.id} className="text-xs border-b border-slate-200/60 pb-1.5 last:border-0">
                      <span className="font-semibold text-slate-800 block truncate">{e.title}</span>
                      <div className="flex items-center justify-between text-slate-400 text-[11px] mt-0.5">
                        <span>{e.courseName}</span>
                        <span className="text-teal-600 font-medium">{toPersianDigits(e.durationMinutes)} دقیقه</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Specific View */}
      {isTeacher && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>کلاس‌های من</span>
            </h2>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium"
            >
              ثبت حضور و غیاب امروز
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.slice(0, 3).map(c => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{c.name}</h3>
                    <span className="text-xs text-slate-500 block mt-0.5">پایه {toPersianDigits(c.gradeLevel)} • {c.track}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                    {toPersianDigits(c.studentCount)} دانش‌آموز
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('grades')}
                    className="text-xs font-medium text-teal-600 hover:text-teal-800"
                  >
                    دفتر نمرات
                  </button>
                  <button
                    onClick={() => onNavigate('attendance')}
                    className="text-xs font-medium text-slate-600 hover:text-slate-800"
                  >
                    حضور و غیاب
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin / Finance Stats Row */}
      {(isAdmin || isFinance) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">کل دانش‌آموزان فعال</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-800">{toPersianDigits(students.length)}</span>
              <span className="text-xs text-slate-400 mr-1.5">نفر در {toPersianDigits(classes.length)} کلاس</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">حضور و غیاب امروز</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-teal-600">{toPersianDigits(presentCount)} حاضر</span>
              <span className="text-xs text-red-500 font-semibold">{toPersianDigits(absentCount)} غایب</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">وصول شهریه سال</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-emerald-600">{toPersianDigits(collectionRate)}٪</span>
              <span className="text-xs text-slate-400 mr-1.5">{formatToman(totalCollected)} وصول شده</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">آزمون‌های فعال مدرسه</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-800">{toPersianDigits(exams.length)}</span>
              <span className="text-xs text-slate-400 mr-1.5">آزمون آنلاین</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Shortcuts (دسترسی سریع) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h2 className="font-bold text-slate-800 text-sm sm:text-base mb-4">
          دسترسی سریع به امکانات سامانه
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(isAdmin || isTeacher) && (
            <>
              <button
                onClick={() => onNavigate('grades')}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-teal-100/60 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block">دفتر نمرات</span>
              </button>

              <button
                onClick={() => onNavigate('attendance')}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-teal-100/60 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block">حضور و غیاب</span>
              </button>

              <button
                onClick={() => onNavigate('exams')}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100/60 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block">آزمون‌های آنلاین</span>
              </button>

              <button
                onClick={() => onNavigate('timetable')}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block">برنامه هفتگی</span>
              </button>

              <button
                onClick={() => onNavigate('study_plans')}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100/60 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block">برنامه‌ریزی مطالعه</span>
              </button>
            </>
          )}

          {(isAdmin || isFinance) && (
            <>
              <button
                onClick={() => onNavigate('finance')}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block">شهریه و اقساط</span>
              </button>

              <button
                onClick={() => onNavigate('expenses')}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-rose-100/60 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold block">هزینه‌های مدرسه</span>
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => onNavigate('people')}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-100/60 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold block">کاربران و اعضا</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('calendar')}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 text-slate-700 text-center transition group"
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-teal-100/60 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold block">تقویم رویدادها</span>
          </button>
        </div>
      </div>

      {/* Two columns: Upcoming Events & Public School Entry URL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-teal-600" />
              <span>رویدادها و برنامه‌های نزدیک مدرسه</span>
            </h2>
            <button
              onClick={() => onNavigate('calendar')}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium"
            >
              مشاهده تقویم کامل
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 3).map(ev => (
              <div key={ev.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{ev.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800">
                      {ev.category === 'EXAM' ? 'امتحان' : ev.category === 'MEETING' ? 'جلسه اولیا' : 'فعالیت'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{ev.description}</p>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-xs font-bold text-teal-700 block bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {toPersianDigits(ev.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* School Public Link Box (Admins & Staff) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-teal-600" />
              <span>پرتال عمومی و معرفی مدرسه</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              این لینک عمومی اختصاصی مدرسه شماست که می‌توانید برای ثبت‌نام اولیه، معرفی مدرسه و ورود اولیا و دانش‌آموزان به اشتراک بگذارید.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 flex items-center justify-between mb-4">
              <span className="truncate max-w-[200px]" dir="ltr">/s/{currentSchool?.slug}</span>
              <button
                onClick={handleCopyLink}
                className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-sans text-xs font-medium"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'کپی شد' : 'کپی لینک'}</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate('public_entry')}
            className="w-full py-2.5 rounded-xl border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>مشاهده صفحه عمومی مدرسه</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
