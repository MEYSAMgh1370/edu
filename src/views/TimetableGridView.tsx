import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import { Clock, Plus, Trash2, Filter } from 'lucide-react';

export const TimetableGridView: React.FC = () => {
  const { classes, timetable, saveTimetableEntry, removeTimetableEntry, memberships, currentSchool } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [day, setDay] = useState(0); // 0: شنبه
  const [period, setPeriod] = useState(1); // 1: زنگ اول
  const [courseName, setCourseName] = useState('شیمی ۱');
  const [teacherId, setTeacherId] = useState('');
  const [room, setRoom] = useState('۱۰۱');

  const teachers = memberships.filter(m => m.role === 'TEACHER');

  const weekdays = [
    { id: 0, label: 'شنبه' },
    { id: 1, label: 'یکشنبه' },
    { id: 2, label: 'دوشنبه' },
    { id: 3, label: 'سه‌شنبه' },
    { id: 4, label: 'چهارشنبه' },
  ];

  const periods = [
    { num: 1, time: '۰۷:۴۵ - ۰۹:۱۵' },
    { num: 2, time: '۰۹:۳۰ - ۱۱:۰۰' },
    { num: 3, time: '۱۱:۱۵ - ۱۲:۴۵' },
    { num: 4, time: '۱۳:۰۰ - ۱۴:۱۵' },
  ];

  const classEntries = timetable.filter(t => t.classId === selectedClassId);

  const getEntry = (d: number, p: number) => {
    return classEntries.find(t => t.day === d && t.period === p);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !courseName) return;

    const teacher = teachers.find(t => t.userId === teacherId)?.user;
    const targetClass = classes.find(c => c.id === selectedClassId);

    saveTimetableEntry({
      schoolId: currentSchool?.id || 'sch-1',
      classId: selectedClassId,
      className: targetClass?.name || 'کلاس',
      day,
      period,
      courseName,
      teacherId: teacherId || 'u-2',
      teacherName: teacher?.name || 'استاد رضایی',
      room
    });

    setIsModalOpen(false);
  };

  const openAddForSlot = (d: number, p: number) => {
    setDay(d);
    setPeriod(p);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="برنامه هفتگی و ساعات دروس"
        subtitle={`جدول زمان‌بندی زنگ‌های درسی در ${currentSchool?.name}`}
        badge={`سال ${toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>تخصیص درس به زنگ</span>
          </button>
        }
      />

      {/* Class filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-slate-700">کلاس مورد نظر:</span>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} (پایه {toPersianDigits(c.gradeLevel)})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-28 border-l border-slate-200">روز هفته</th>
                {periods.map(p => (
                  <th key={p.num} className="py-3 px-3 border-l border-slate-200 last:border-l-0">
                    <div>زنگ {toPersianDigits(p.num)}</div>
                    <div className="text-[11px] font-normal text-slate-400 mt-0.5">{toPersianDigits(p.time)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {weekdays.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-3 font-bold text-slate-800 bg-slate-50/70 border-l border-slate-200">
                    {d.label}
                  </td>
                  {periods.map(p => {
                    const entry = getEntry(d.id, p.num);
                    return (
                      <td key={p.num} className="py-3 px-3 border-l border-slate-200 last:border-l-0 h-24 align-top">
                        {entry ? (
                          <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 text-right relative group">
                            <span className="font-bold text-teal-900 block text-xs">{entry.courseName}</span>
                            <span className="text-[11px] text-teal-700 block mt-0.5">{entry.teacherName}</span>
                            {entry.room && (
                              <span className="text-[10px] text-slate-500 block mt-1">کلاس {toPersianDigits(entry.room)}</span>
                            )}
                            <button
                              onClick={() => removeTimetableEntry(entry.id)}
                              className="absolute top-1.5 left-1.5 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                              title="حذف این زنگ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openAddForSlot(d.id, p.num)}
                            className="w-full h-full min-h-[70px] border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50/30 transition text-xs"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">تعیین درس برای زنگ هفتگی</h3>
            <p className="text-xs text-slate-500 mb-4">
              درس، دبیر و شماره کلاس را مشخص نمایید.
            </p>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">روز هفته *</label>
                  <select
                    value={day}
                    onChange={e => setDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {weekdays.map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شماره زنگ *</label>
                  <select
                    value={period}
                    onChange={e => setPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {periods.map(p => (
                      <option key={p.num} value={p.num}>زنگ {toPersianDigits(p.num)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نام درس *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شیمی ۱، زیست‌شناسی، حسابان"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">دبیر تدریس‌کننده</label>
                <select
                  value={teacherId}
                  onChange={e => setTeacherId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">انتخاب دبیر</option>
                  {teachers.map(t => (
                    <option key={t.userId} value={t.userId}>{t.user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شماره اتاق / آزمایشگاه</label>
                <input
                  type="text"
                  placeholder="۱۰۱ یا آزمایشگاه فیزیک"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
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
                  ثبت در برنامه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
