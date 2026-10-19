import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, getTodayJalali } from '../utils/jalali';
import {
  CalendarCheck,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Calendar,
  Filter,
  Check,
  X,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

interface AttendanceViewProps {
  onNavigate: (page: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onNavigate }) => {
  const {
    classes,
    students,
    attendance,
    excuses,
    saveAttendanceRoll,
    decideExcuse,
    currentSchool
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ROLL' | 'EXCUSES' | 'REPORT'>('ROLL');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(getTodayJalali());
  const [notice, setNotice] = useState<string | null>(null);

  // Local draft status for current class roll
  const [draftRoll, setDraftRoll] = useState<Record<string, AttendanceStatus>>({});

  const classStudents = students.filter(st => st.classId === selectedClassId);

  const getExistingStatus = (studentId: string): AttendanceStatus => {
    if (draftRoll[studentId]) return draftRoll[studentId];
    const rec = attendance.find(a =>
      a.classId === selectedClassId &&
      a.date === selectedDate &&
      a.studentId === studentId
    );
    return rec ? rec.status : 'PRESENT'; // Default to present
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setDraftRoll(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveRoll = () => {
    const records = classStudents.map(st => ({
      schoolId: currentSchool?.id || 'sch-1',
      classId: selectedClassId,
      date: selectedDate,
      studentId: st.id,
      studentName: st.name,
      status: getExistingStatus(st.id)
    }));

    saveAttendanceRoll(records);
    setNotice(`دفتر حضور و غیاب تاریخ ${toPersianDigits(selectedDate)} با موفقیت ثبت شد.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const pendingExcuses = excuses.filter(e => e.status === 'PENDING');

  return (
    <div className="space-y-6">
      <PageHeader
        title="حضور و غیاب کلاسی"
        subtitle={`ثبت و پیگیری غیبت‌ها و تاخیر دانش‌آموزان در ${currentSchool?.name}`}
        badge={`امروز: ${toPersianDigits(getTodayJalali())}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('attendance_print')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ فرم حضور و غیاب</span>
            </button>
            <button
              onClick={handleSaveRoll}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ثبت دفتر حضور و غیاب</span>
            </button>
          </div>
        }
      />

      {notice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-teal-600 hover:text-teal-900 font-bold">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ROLL')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ROLL'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>ثبت دفتر کلاسی</span>
        </button>

        <button
          onClick={() => setActiveTab('EXCUSES')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'EXCUSES'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>بررسی درخواست‌های موجه‌سازی</span>
          {pendingExcuses.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {toPersianDigits(pendingExcuses.length)}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'ROLL' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Filter className="w-4 h-4 text-teal-600" />
                <span>کلاس درس:</span>
              </div>
              <select
                value={selectedClassId}
                onChange={e => {
                  setSelectedClassId(e.target.value);
                  setDraftRoll({});
                }}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>تاریخ ثبت:</span>
              </div>
              <input
                type="text"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-mono text-center"
              />
            </div>
          </div>

          {/* Roll table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">ردیف</th>
                    <th className="py-3 px-4">نام دانش‌آموز</th>
                    <th className="py-3 px-4">کد ملی</th>
                    <th className="py-3 px-4 text-center">وضعیت حضور در کلاس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((st, idx) => {
                    const status = getExistingStatus(st.id);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 text-center text-slate-400 font-mono">
                          {toPersianDigits(idx + 1)}
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {st.name}
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-500">
                          {toPersianDigits(st.nationalCode)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <button
                              type="button"
                              onClick={() => setStatus(st.id, 'PRESENT')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>حاضر</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setStatus(st.id, 'LATE')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                status === 'LATE'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>تاخیر</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setStatus(st.id, 'ABSENT')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                status === 'ABSENT'
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>غایب</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setStatus(st.id, 'EXCUSED')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                status === 'EXCUSED'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>غایب موجه</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {classStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        دانش‌آموزی در این کلاس یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EXCUSES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">
              درخواست‌های موجه‌سازی غیبت ارسالی از طرف اولیا و دانش‌آموزان
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {excuses.map(ex => (
              <div key={ex.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{ex.studentName}</span>
                    <span className="text-xs text-slate-400">برای تاریخ {toPersianDigits(ex.date)}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      ex.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      ex.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ex.status === 'APPROVED' ? 'تایید شده (موجه)' : ex.status === 'REJECTED' ? 'رد شده' : 'در انتظار بررسی'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    علت غیبت: {ex.reason}
                  </p>
                  {ex.adminComment && (
                    <p className="text-xs text-teal-700 mt-1">
                      پاسخ مدرسه: {ex.adminComment}
                    </p>
                  )}
                </div>

                {ex.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => decideExcuse(ex.id, 'APPROVED', 'موافقت شد')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>تایید و موجه‌سازی</span>
                    </button>
                    <button
                      onClick={() => decideExcuse(ex.id, 'REJECTED', 'عدم ارائه مدارک پزشکی')}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>رد درخواست</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {excuses.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                هیچ درخواستی برای موجه‌سازی غیبت ثبت نشده است.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
