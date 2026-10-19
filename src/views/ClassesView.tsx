import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import { BookOpen, Plus, Users, GraduationCap, School } from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, addClass, memberships, currentSchool } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(10);
  const [track, setTrack] = useState('علوم تجربی');
  const [teacherId, setTeacherId] = useState('');

  const teachers = memberships.filter(m => m.role === 'TEACHER');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addClass(name.trim(), gradeLevel, track, teacherId || undefined);
    setIsModalOpen(false);
    setName('');
    setTeacherId('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="کلاس‌های درس"
        subtitle={`فهرست کلاس‌ها و پایه‌های تحصیلی در ${currentSchool?.name} (سال ${toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')})`}
        badge={`${toPersianDigits(classes.length)} کلاس`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>تعریف کلاس جدید</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  پایه {toPersianDigits(c.gradeLevel)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {c.track || 'عمومی'}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-base mb-1">{c.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                <School className="w-3.5 h-3.5 text-slate-400" />
                <span>سال تحصیلی {toPersianDigits(c.academicYear)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span>دبیر: <strong>{c.teacherName || 'تعیین‌نشده'}</strong></span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{toPersianDigits(c.studentCount)} نفر</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-sm mb-1">هنوز کلاسی ثبت نشده است</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            برای ثبت نمرات و حضور و غیاب، ابتدا کلاس‌های مدرسه را تعریف فرمایید.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
          >
            تعریف اولین کلاس
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">تعریف کلاس درس جدید</h3>
            <p className="text-xs text-slate-500 mb-5">
              مشخصات کلاس و آموزگار مربوطه را وارد کنید.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نام کلاس *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دهم تجربی الف"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">پایه تحصیلی *</label>
                  <select
                    value={gradeLevel}
                    onChange={e => setGradeLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                  >
                    {[7, 8, 9, 10, 11, 12].map(lvl => (
                      <option key={lvl} value={lvl}>پایه {toPersianDigits(lvl)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رشته / گرایش</label>
                  <select
                    value={track}
                    onChange={e => setTrack(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                  >
                    <option value="علوم تجربی">علوم تجربی</option>
                    <option value="ریاضی فیزیک">ریاضی فیزیک</option>
                    <option value="علوم انسانی">علوم انسانی</option>
                    <option value="عمومی">عمومی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">دبیر یا آموزگار مسئول</label>
                <select
                  value={teacherId}
                  onChange={e => setTeacherId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                >
                  <option value="">انتخاب نشده (تعیین بعداً)</option>
                  {teachers.map(t => (
                    <option key={t.userId} value={t.userId}>{t.user.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
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
                  ثبت کلاس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
