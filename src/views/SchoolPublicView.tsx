import React from 'react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/jalali';
import {
  GraduationCap,
  Building2,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  ArrowRight,
  LogIn
} from 'lucide-react';

interface SchoolPublicViewProps {
  onBackToApp: () => void;
  onLoginClick: () => void;
}

export const SchoolPublicView: React.FC<SchoolPublicViewProps> = ({ onBackToApp, onLoginClick }) => {
  const { currentSchool, classes } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm sm:text-base block">{currentSchool?.name}</span>
              <span className="text-[11px] text-teal-700 font-medium">{currentSchool?.levelTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
            >
              داشبورد مدیریت
            </button>
            <button
              onClick={onLoginClick}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>ورود به پرتال اولیا و دانش‌آموزان</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-800 to-teal-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 text-teal-200 text-xs font-medium border border-teal-600">
            پرتال اختصاصی آموزشگاه هوشمند
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            {currentSchool?.name}
          </h1>
          <p className="text-teal-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            محیطی پویا برای شکوفایی استعدادهای علمی و اخلاقی دانش‌آموزان با بهره‌گیری از سامانه جامع رشدِ اندیشه، دفتر نمرات آنلاین، آزمون‌های تستی و برنامه‌ریزی مطالعاتی هوشمند.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onLoginClick}
              className="px-6 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs sm:text-sm hover:bg-teal-50 shadow-md transition"
            >
              مشاهده نمرات و کارنامه فرزندان
            </button>
          </div>
        </div>
      </section>

      {/* Main Info */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Classes & Branches */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span>پایه‌ها و کلاس‌های فعال در سال تحصیلی {toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {classes.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  پایه {toPersianDigits(c.gradeLevel)}
                </span>
                <h3 className="font-bold text-slate-800 text-sm mt-3">{c.name}</h3>
                <span className="text-xs text-slate-400 block mt-1">{c.track || 'عمومی'}</span>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>دبیر: {c.teacherName || 'تعیین شده'}</span>
                  <span className="font-bold text-slate-700">{toPersianDigits(c.studentCount)} دانش‌آموز</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact and Location */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>ارتباط با دفتر مدرسه</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              {currentSchool?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>نشانی: {currentSchool.address}</span>
                </div>
              )}
              {currentSchool?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>تلفن تماس: <span dir="ltr" className="font-mono">{toPersianDigits(currentSchool.phone)}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>ساعات پاسخگویی: شنبه تا چهارشنبه از ساعت ۷:۳۰ الی ۱۴:۳۰</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-800 text-xs block mb-1">اتصال به سامانه اولیا</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                کلیه اولیا و دانش‌آموزان گرامی می‌توانند با کدملی و رمز عبور اختصاصی وارد سامانه شده و به کارنامه، نمرات مستمر، وضعیت شهریه و آزمون‌های آنلاین دسترسی داشته باشند.
              </p>
            </div>
            <button
              onClick={onLoginClick}
              className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              ورود به حساب کاربری
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-white">
        تمامی حقوق برای {currentSchool?.name} محفوظ است • پشتیبانی شده توسط رشدِ اندیشه
      </footer>
    </div>
  );
};
