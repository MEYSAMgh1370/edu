import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Award,
  CalendarCheck,
  Clock,
  Layers,
  FileCheck2,
  FileText,
  CalendarDays,
  CreditCard,
  Receipt,
  User,
  Settings,
  CalendarRange,
  ArrowUpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const { currentRole } = useApp();

  const isAdmin = currentRole === 'SCHOOL_ADMIN';
  const isTeacher = currentRole === 'TEACHER';
  const isFinance = currentRole === 'FINANCE_ADMIN';
  const isStudent = currentRole === 'STUDENT';
  const isParent = currentRole === 'PARENT';

  const handleNav = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const navItemClass = (page: string) => `
    flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer
    ${
      currentPage === page
        ? 'bg-teal-600 text-white shadow-xs font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }
  `;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-slate-800 text-sm">منوی ناوبری</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable menu links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Dashboard */}
          <div>
            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full ${navItemClass('dashboard')}`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>پیشخوان اصلی</span>
            </button>
          </div>

          {/* Group 1: مدیریت و افراد (Admin only) */}
          {isAdmin && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                مدیریت و کاربران
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('people')}
                  className={`w-full ${navItemClass('people')}`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>اعضا و کاربران</span>
                </button>
                <button
                  onClick={() => handleNav('roles')}
                  className={`w-full ${navItemClass('roles')}`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>نقش‌ها و دسترسی‌ها</span>
                </button>
              </div>
            </div>
          )}

          {/* Group 2: آموزش و کلاس‌ها (Admin & Teacher) */}
          {(isAdmin || isTeacher) && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                آموزش و کلاس‌ها
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('classes')}
                  className={`w-full ${navItemClass('classes')}`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>کلاس‌های درسی</span>
                </button>
                <button
                  onClick={() => handleNav('students')}
                  className={`w-full ${navItemClass('students')}`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>دانش‌آموزان و اولیا</span>
                </button>
                <button
                  onClick={() => handleNav('grades')}
                  className={`w-full ${navItemClass('grades')}`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>دفتر ثبت نمرات</span>
                </button>
                <button
                  onClick={() => handleNav('attendance')}
                  className={`w-full ${navItemClass('attendance')}`}
                >
                  <CalendarCheck className="w-4 h-4 shrink-0" />
                  <span>حضور و غیاب کلاسی</span>
                </button>
                <button
                  onClick={() => handleNav('timetable')}
                  className={`w-full ${navItemClass('timetable')}`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>برنامه هفتگی مدارس</span>
                </button>
              </div>
            </div>
          )}

          {/* Group 3: محتوا، آزمون و برنامه‌ریزی (Admin & Teacher) */}
          {(isAdmin || isTeacher) && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                آزمون و محتوا
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('curriculum')}
                  className={`w-full ${navItemClass('curriculum')}`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>بانک سؤالات و سرفصل‌ها</span>
                </button>
                <button
                  onClick={() => handleNav('exams')}
                  className={`w-full ${navItemClass('exams')}`}
                >
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                  <span>آزمون‌های آنلاین</span>
                </button>
                <button
                  onClick={() => handleNav('question_box')}
                  className={`w-full ${navItemClass('question_box')}`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>باکس سؤال و برگه چاپی</span>
                </button>
                <button
                  onClick={() => handleNav('study_plans')}
                  className={`w-full ${navItemClass('study_plans')}`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span>برنامه‌ریزی مطالعاتی</span>
                </button>
              </div>
            </div>
          )}

          {/* Group 4: امور مالی و شهریه (Admin & Finance) */}
          {(isAdmin || isFinance) && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                امور مالی و حسابداری
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('finance')}
                  className={`w-full ${navItemClass('finance')}`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>شهریه و اقساط</span>
                </button>
                <button
                  onClick={() => handleNav('expenses')}
                  className={`w-full ${navItemClass('expenses')}`}
                >
                  <Receipt className="w-4 h-4 shrink-0" />
                  <span>هزینه‌های جاری مدرسه</span>
                </button>
              </div>
            </div>
          )}

          {/* Group 5: پرتال من (Student & Parent) */}
          {(isStudent || isParent) && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isParent ? 'پرتال اولیا و فرزندان' : 'پرتال دانش‌آموز'}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('my_grades')}
                  className={`w-full ${navItemClass('my_grades')}`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>کارنامه و نمرات من</span>
                </button>
                <button
                  onClick={() => handleNav('my_exams')}
                  className={`w-full ${navItemClass('my_exams')}`}
                >
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                  <span>آزمون‌های من</span>
                </button>
                <button
                  onClick={() => handleNav('my_attendance')}
                  className={`w-full ${navItemClass('my_attendance')}`}
                >
                  <CalendarCheck className="w-4 h-4 shrink-0" />
                  <span>حضور و غیاب من</span>
                </button>
                {isStudent && (
                  <button
                    onClick={() => handleNav('my_study_plan')}
                    className={`w-full ${navItemClass('my_study_plan')}`}
                  >
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    <span>برنامه مطالعاتی من</span>
                  </button>
                )}
                <button
                  onClick={() => handleNav('my_timetable')}
                  className={`w-full ${navItemClass('my_timetable')}`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>برنامه هفتگی کلاس</span>
                </button>
                <button
                  onClick={() => handleNav('my_invoices')}
                  className={`w-full ${navItemClass('my_invoices')}`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>صورتحساب و اقساط</span>
                </button>
              </div>
            </div>
          )}

          {/* Group 6: تنظیمات و تقویم */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              تقویم و سامانه
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNav('calendar')}
                className={`w-full ${navItemClass('calendar')}`}
              >
                <CalendarRange className="w-4 h-4 shrink-0" />
                <span>تقویم رویدادها و تعطیلات</span>
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleNav('settings')}
                    className={`w-full ${navItemClass('settings')}`}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>تنظیمات مدرسه</span>
                  </button>
                  <button
                    onClick={() => handleNav('promotion')}
                    className={`w-full ${navItemClass('promotion')}`}
                  >
                    <ArrowUpCircle className="w-4 h-4 shrink-0" />
                    <span>ارتقای پایه سالانه</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-center text-[11px] text-slate-400">
          نسخه ۲.۰ ابری • رشدِ اندیشه
        </div>
      </aside>
    </>
  );
};
