import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, PERSIAN_WEEKDAYS } from '../utils/jalali';
import {
  CalendarDays,
  Plus,
  Clock,
  BookOpen,
  CheckCircle2,
  Users
} from 'lucide-react';

export const StudyPlansView: React.FC = () => {
  const { studyPlans, students, createStudyPlan, currentSchool } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [weekNumber, setWeekNumber] = useState(3);
  const [gradeLevel, setGradeLevel] = useState(10);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createStudyPlan({
      schoolId: currentSchool?.id || 'sch-1',
      title: title.trim(),
      gradeLevel,
      weekNumber,
      assignedStudentIds: students.map(s => s.id),
      intervals: [
        { id: `it-${Date.now()}-1`, planId: 'sp-new', dayOfWeek: 0, startTime: '16:00', durationMinutes: 90, courseName: 'شیمی ۱', topicTitle: 'حل تست‌های استوکیومتری', completed: false },
        { id: `it-${Date.now()}-2`, planId: 'sp-new', dayOfWeek: 0, startTime: '18:00', durationMinutes: 60, courseName: 'ریاضی ۱', topicTitle: 'مفهوم تابع و ضابطه', completed: false },
        { id: `it-${Date.now()}-3`, planId: 'sp-new', dayOfWeek: 1, startTime: '16:30', durationMinutes: 90, courseName: 'زیست‌شناسی ۱', topicTitle: 'بافت‌های جانوری و گیاهی', completed: false },
        { id: `it-${Date.now()}-4`, planId: 'sp-new', dayOfWeek: 2, startTime: '17:00', durationMinutes: 60, courseName: 'فیزیک ۱', topicTitle: 'چگالی و تبدیل یکاها', completed: false },
      ]
    });

    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="برنامه‌ریزی مطالعاتی دانش‌آموزان"
        subtitle={`تدوین برنامه‌های هفتگی مطالعه و تکالیف کنکوری و درسی در ${currentSchool?.name}`}
        badge={`${toPersianDigits(studyPlans.length)} برنامه`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>تدوین برنامه مطالعاتی جدید</span>
          </button>
        }
      />

      <div className="space-y-6">
        {studyPlans.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    پایه {toPersianDigits(plan.gradeLevel)} • هفته {toPersianDigits(plan.weekNumber)}
                  </span>
                  <span className="text-xs text-slate-400">
                    تخصیص به {toPersianDigits(plan.assignedStudentIds.length)} دانش‌آموز
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base">{plan.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 font-semibold">
                  {toPersianDigits(plan.intervals.length)} پارت مطالعاتی
                </span>
              </div>
            </div>

            {/* Intervals schedule list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {plan.intervals.map(it => (
                <div key={it.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-teal-800">
                      {PERSIAN_WEEKDAYS[it.dayOfWeek] || 'شنبه'} • ساعت {toPersianDigits(it.startTime)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {toPersianDigits(it.durationMinutes)} دقیقه
                    </span>
                  </div>

                  <span className="font-bold text-xs text-slate-800 block">{it.courseName}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">{it.topicTitle}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">تدوین برنامه مطالعاتی</h3>
            <p className="text-xs text-slate-500 mb-4">تنظیم پارت‌های هفتگی مطالعه دانش‌آموزان</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان برنامه *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: برنامه هفتگی آبان ماه - پایه دهم تجربی"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شماره هفته</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={weekNumber}
                    onChange={e => setWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">پایه تحصیلی</label>
                  <select
                    value={gradeLevel}
                    onChange={e => setGradeLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {[7, 8, 9, 10, 11, 12].map(g => (
                      <option key={g} value={g}>پایه {toPersianDigits(g)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                برنامه به صورت هوشمند بین روزهای هفته شنبه تا چهارشنبه توزیع و برای دانش‌آموزان این پایه ارسال می‌گردد.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  ایجاد برنامه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
