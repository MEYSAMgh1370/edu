import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Building2,
  UserCheck,
  LogOut,
  ChevronDown,
  Menu,
  Plus,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { toPersianDigits } from '../../utils/jalali';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const {
    currentUser,
    currentSchool,
    currentRole,
    schools,
    setCurrentSchoolId,
    setCurrentRole,
    logout
  } = useApp();

  const [schoolMenuOpen, setSchoolMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const rolesList: { code: UserRole; title: string }[] = [
    { code: 'SCHOOL_ADMIN', title: 'مدیر کل مدرسه' },
    { code: 'TEACHER', title: 'دبیر / آموزگار' },
    { code: 'FINANCE_ADMIN', title: 'مسئول مالی' },
    { code: 'STUDENT', title: 'دانش‌آموز' },
    { code: 'PARENT', title: 'ولی دانش‌آموز' },
  ];

  const currentRoleTitle = rolesList.find(r => r.code === currentRole)?.title || 'کاربر';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Right side: Sidebar toggle and Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            title="منوی ناوبری"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-right cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 block leading-tight">رشدِ اندیشه</span>
              <span className="text-xs text-teal-700 font-medium hidden sm:block">سامانه مدیریت مدارس</span>
            </div>
          </button>
        </div>

        {/* Center / School & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* School Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSchoolMenuOpen(!schoolMenuOpen);
                setRoleMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-medium text-slate-700 transition"
            >
              <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {currentSchool?.name || 'انتخاب مدرسه'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {schoolMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100">
                  مدارس فعال شما
                </div>
                {schools.map(sch => (
                  <button
                    key={sch.id}
                    onClick={() => {
                      setCurrentSchoolId(sch.id);
                      setSchoolMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-50 ${
                      sch.id === currentSchool?.id ? 'text-teal-700 font-semibold bg-teal-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate">{sch.name}</span>
                    {sch.id === currentSchool?.id && (
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    )}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setSchoolMenuOpen(false);
                      onNavigate('schools_new');
                    }}
                    className="w-full text-right px-3 py-2 text-xs font-medium text-teal-600 hover:bg-teal-50 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ثبت مدرسه جدید</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Academic Year indicator */}
          {currentSchool && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-medium border border-teal-200">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>سال {toPersianDigits(currentSchool.currentAcademicYear)}</span>
            </div>
          )}

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen);
                setSchoolMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 text-xs sm:text-sm font-medium transition shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px] sm:max-w-none">{currentRoleTitle}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100">
                  تغییر نمای کاربری
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.code}
                    onClick={() => {
                      setCurrentRole(r.code);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-50 ${
                      r.code === currentRole ? 'text-teal-700 font-bold bg-teal-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.title}</span>
                    {r.code === currentRole && (
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Left side: User profile & public site link */}
        <div className="flex items-center gap-2">
          {currentSchool && (
            <button
              onClick={() => onNavigate('public_entry')}
              className="hidden lg:flex items-center gap-1 text-xs text-slate-500 hover:text-teal-700 px-2 py-1.5 rounded-md hover:bg-slate-100 transition"
              title="صفحه عمومی مدرسه"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>پرتال عمومی</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
              {currentUser?.name?.slice(0, 1) || 'ک'}
            </div>
            <div className="hidden xl:block text-right">
              <span className="text-xs font-semibold text-slate-800 block truncate max-w-[120px]">
                {currentUser?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="خروج از حساب"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
