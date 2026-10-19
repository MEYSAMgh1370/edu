import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, formatToman, PERSIAN_WEEKDAYS, getTodayJalali } from '../utils/jalali';
import {
  Award,
  FileCheck2,
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Plus
} from 'lucide-react';

// 1. MyGradesView
export const MyGradesView: React.FC = () => {
  const { students, grades, currentSchool, currentRole } = useApp();
  const student = students[0]; // Active student or linked child
  const studentGrades = grades.filter(g => g.studentId === student?.id);

  const avg = studentGrades.length > 0
    ? (studentGrades.reduce((s, g) => s + (g.score ?? 0), 0) / studentGrades.length).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentRole === 'PARENT' ? `کارنامه تحصیلی فرزند: ${student?.name}` : 'کارنامه و نمرات تحصیلی من'}
        subtitle={`گزارش نمرات مستمر و پایانی سال تحصیلی ${toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}`}
        badge={`معدل: ${toPersianDigits(avg)}`}
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">نام درس</th>
                <th className="py-3 px-4">نوبت تحصیلی</th>
                <th className="py-3 px-4">نمره از ۲۰</th>
                <th className="py-3 px-4">ارزیابی توصیفی</th>
                <th className="py-3 px-4">تاریخ ثبت نمره</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentGrades.map(g => (
                <tr key={g.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{g.courseName}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {g.term === 'CONTINUOUS_1' ? 'مستمر نوبت اول' : g.term === 'TERM_1' ? 'پایانی نوبت اول' : 'نوبت دوم'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      {toPersianDigits(g.score ?? 0)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {g.descriptive === 'EXCELLENT' ? 'خیلی خوب' : 'خوب'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">
                    {toPersianDigits(g.updatedAt)}
                  </td>
                </tr>
              ))}
              {studentGrades.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    هنوز نمره‌ای برای شما ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. MyExamsView
export const MyExamsView: React.FC<{ onStartExam: (id: string) => void }> = ({ onStartExam }) => {
  const { exams, examAttempts, students } = useApp();
  const student = students[0];

  const myAttempts = examAttempts.filter(a => a.studentId === student?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="آزمون‌های آنلاین من"
        subtitle="آزمون‌های فعال و سوابق شرکت در ارزیابی‌های تستی"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exams.map(ex => {
          const attempt = myAttempts.find(a => a.examId === ex.id);
          return (
            <div key={ex.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-800">
                    {ex.courseName}
                  </span>
                  {attempt ? (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      شرکت کرده‌اید
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      آماده شروع
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-base mb-2">{ex.title}</h3>
                <div className="space-y-1 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>مدت زمان: <strong>{toPersianDigits(ex.durationMinutes)} دقیقه</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>بارم کل: <strong>{toPersianDigits(ex.totalPoints)} نمره</strong></span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                {attempt ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">نمره کسب شده:</span>
                    <span className="text-sm font-bold text-teal-700">
                      {toPersianDigits(attempt.score ?? 0)} از {toPersianDigits(attempt.totalPossibleScore)}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartExam(ex.id)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>ورود و شروع آزمون</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. MyAttendanceView
export const MyAttendanceView: React.FC = () => {
  const { students, attendance, submitExcuse } = useApp();
  const student = students[0];
  const myRecords = attendance.filter(a => a.studentId === student?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excuseDate, setExcuseDate] = useState(getTodayJalali());
  const [reason, setReason] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const handleSendExcuse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    submitExcuse(student.id, excuseDate, reason.trim());
    setIsModalOpen(false);
    setReason('');
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="حضور و غیاب و انضباطی من"
        subtitle="سوابق ورود و خروج، غیبت‌ها و درخواست‌های موجه‌سازی"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Send className="w-4 h-4" />
            <span>ارسال درخواست موجه‌سازی غیبت</span>
          </button>
        }
      />

      {sentNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-600" />
          <span>درخواست موجه‌سازی شما برای کادر آموزش و معاونت مدرسه ارسال شد.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">تاریخ</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">توضیحات معاونت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {toPersianDigits(rec.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold inline-flex items-center gap-1 ${
                      rec.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      rec.status === 'LATE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      rec.status === 'EXCUSED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {rec.status === 'PRESENT' ? 'حاضر' : rec.status === 'LATE' ? 'تاخیر در ورود' : rec.status === 'EXCUSED' ? 'غیبت موجه' : 'غایب'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {rec.note || '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">درخواست موجه‌سازی غیبت</h3>
            <p className="text-xs text-slate-500 mb-4">توضیحات و علت عدم حضور را جهت بررسی ثبت کنید.</p>

            <form onSubmit={handleSendExcuse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تاریخ روز غیبت</label>
                <input
                  type="text"
                  value={excuseDate}
                  onChange={e => setExcuseDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">علت و توضیحات *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="علت غیبت (بیماری، فوت اقوام، موارد پیش‌بینی‌نشده)..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
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
                  ارسال به مدرسه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. MyStudyPlanView
export const MyStudyPlanView: React.FC = () => {
  const { studyPlans, toggleIntervalCompleted } = useApp();
  const plan = studyPlans[0];

  const total = plan?.intervals.length || 0;
  const done = plan?.intervals.filter(i => i.completed).length || 0;
  const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="برنامه مطالعاتی هفتگی من"
        subtitle={plan?.title || 'برنامه مطالعه و تست هفتگی'}
        badge={`پیشرفت: ${toPersianDigits(progressPercent)}٪`}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span>انجام پارت‌های درسی:</span>
          <span>{toPersianDigits(done)} از {toPersianDigits(total)} پارت مطالعه شده</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plan?.intervals.map(it => (
          <div
            key={it.id}
            onClick={() => toggleIntervalCompleted(plan.id, it.id)}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
              it.completed
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                it.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {it.completed && <CheckCircle className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-xs block">{it.courseName}</span>
                <span className="text-xs text-slate-500 block">{it.topicTitle}</span>
              </div>
            </div>

            <div className="text-left shrink-0 text-xs font-mono text-slate-400">
              <div>{PERSIAN_WEEKDAYS[it.dayOfWeek] || 'شنبه'}</div>
              <div>{toPersianDigits(it.durationMinutes)} دقیقه</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. MyTimetableView
export const MyTimetableView: React.FC = () => {
  const { timetable, students } = useApp();
  const student = students[0];
  const classEntries = timetable.filter(t => t.classId === student?.classId);

  const weekdays = [
    { id: 0, label: 'شنبه' },
    { id: 1, label: 'یکشنبه' },
    { id: 2, label: 'دوشنبه' },
    { id: 3, label: 'سه‌شنبه' },
    { id: 4, label: 'چهارشنبه' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="برنامه کلاسی هفتگی من"
        subtitle={`ساعات درسی و زنگ‌های کلاسی (${student?.className})`}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {weekdays.map(d => {
          const dayEntries = classEntries.filter(t => t.day === d.id);
          return (
            <div key={d.id} className="border-b border-slate-100 last:border-b-0 pb-3">
              <span className="font-bold text-xs text-teal-800 block mb-2">{d.label}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(pNum => {
                  const entry = dayEntries.find(e => e.period === pNum);
                  return (
                    <div key={pNum} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-right">
                      <span className="text-[10px] text-slate-400 block">زنگ {toPersianDigits(pNum)}</span>
                      {entry ? (
                        <>
                          <span className="font-bold text-xs text-slate-800 block">{entry.courseName}</span>
                          <span className="text-[10px] text-teal-600 block">{entry.teacherName}</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-300 block">آزاد</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 6. MyInvoicesView
export const MyInvoicesView: React.FC = () => {
  const { invoices, students, currentRole } = useApp();
  const student = students[0];
  const invoice = invoices.find(inv => inv.studentId === student?.id) || invoices[0];

  const total = invoice?.totalAmount || 0;
  const discount = invoice?.discountAmount || 0;
  const paid = invoice?.paidAmount || 0;
  const balance = total - discount - paid;

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentRole === 'PARENT' ? `صورتحساب شهریه: ${student?.name}` : 'صورتحساب و وضعیت اقساط شهریه'}
        subtitle={`سال تحصیلی ${toPersianDigits(invoice?.academicYear || '1403-1404')}`}
        badge={balance <= 0 ? 'تسویه کامل' : `مانده: ${formatToman(balance)}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">مبلغ کل شهریه سال</span>
          <span className="text-xl font-bold text-slate-800">{formatToman(total)}</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">مجموع مبالغ پرداخت‌شده</span>
          <span className="text-xl font-bold text-emerald-600">{formatToman(paid)}</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">مانده بدهی شهریه</span>
          <span className="text-xl font-bold text-amber-600">{formatToman(Math.max(0, balance))}</span>
        </div>
      </div>

      {/* Installments List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="font-bold text-slate-800 text-sm mb-4">برنامه اقساط شهریه</h3>
        <div className="space-y-3">
          {invoice?.installments.map(ins => (
            <div key={ins.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800 block">قسط شماره {toPersianDigits(ins.installmentNumber)}</span>
                <span className="text-xs text-slate-400">سررسید: {toPersianDigits(ins.dueDate)}</span>
              </div>
              <div className="text-left">
                <span className="font-bold text-xs text-slate-800 block">{formatToman(ins.amount)}</span>
                <span className={`text-[11px] font-bold ${ins.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {ins.status === 'PAID' ? 'پرداخت شده' : 'در انتظار سررسید'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
