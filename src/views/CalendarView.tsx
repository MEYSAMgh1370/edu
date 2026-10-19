import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, getTodayJalali } from '../utils/jalali';
import {
  CalendarDays,
  Plus,
  Bell,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { events, addEvent, currentSchool } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayJalali());
  const [category, setCategory] = useState<'EXAM' | 'HOLIDAY' | 'MEETING' | 'ACTIVITY'>('MEETING');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      schoolId: currentSchool?.id || 'sch-1',
      title: title.trim(),
      date,
      category,
      academicYear: currentSchool?.currentAcademicYear || '1403-1404',
      description: description.trim(),
      reminderRoles: ['PARENT', 'TEACHER']
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تقویم سالانه و رویدادهای آموزشی"
        subtitle={`برنامه‌ریزی جلسات، آزمون‌ها و رویدادهای فرهنگی ${currentSchool?.name}`}
        badge={`سال ${toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت رویداد جدید</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  ev.category === 'EXAM' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                  ev.category === 'HOLIDAY' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  ev.category === 'MEETING' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-teal-50 text-teal-700 border border-teal-200'
                }`}>
                  {ev.category === 'EXAM' ? 'امتحان و آزمون' :
                   ev.category === 'HOLIDAY' ? 'تعطیل رسمی' :
                   ev.category === 'MEETING' ? 'جلسه اولیا و مربیان' : 'فعالیت پرورشی / اردو'}
                </span>

                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {toPersianDigits(ev.date)}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-sm mb-2">{ev.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                {ev.description}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-teal-600" />
                <span>یادآوری خودکار بله</span>
              </div>
              <span>سال تحصیلی {toPersianDigits(ev.academicYear)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">افزودن رویداد تقویم مدرسه</h3>
            <p className="text-xs text-slate-500 mb-4">جلسات، امتحانات یا تعطیلات خاص</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان رویداد *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: اردوی بازدید از پارک فناوری پردیس"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع رویداد</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="MEETING">جلسه اولیا و مربیان</option>
                    <option value="EXAM">امتحانات پایان‌ترم</option>
                    <option value="ACTIVITY">اردو یا فعالیت پرورشی</option>
                    <option value="HOLIDAY">تعطیلی آموزشی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاریخ (جلالی)</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شرح و جزئیات</label>
                <textarea
                  rows={3}
                  placeholder="ساعت برگزاری، مخاطبین و توصیه‌ها..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

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
                  ثبت رویداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
