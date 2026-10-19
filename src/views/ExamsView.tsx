import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import {
  FileCheck2,
  Plus,
  Play,
  Users,
  Clock,
  Award,
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';

interface ExamsViewProps {
  onStartExam: (examId: string) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ onStartExam }) => {
  const { exams, examAttempts, classes, questionBank, createExam, currentSchool } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedExamAttempts, setSelectedExamAttempts] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('شیمی ۱');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [passScore, setPassScore] = useState(10);
  const [totalPoints, setTotalPoints] = useState(20);
  const [assignedClassId, setAssignedClassId] = useState(classes[0]?.id || '');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestions(prev =>
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedQuestions.length === 0) return;

    createExam({
      schoolId: currentSchool?.id || 'sch-1',
      title: title.trim(),
      courseName,
      gradeLevel: 10,
      durationMinutes,
      totalPoints,
      passScore,
      startDate: '1403/08/01',
      endDate: '1403/09/30',
      status: 'ACTIVE',
      assignedClassIds: [assignedClassId]
    }, selectedQuestions);

    setIsCreateModalOpen(false);
    setTitle('');
    setSelectedQuestions([]);
  };

  const activeAttempts = selectedExamAttempts
    ? examAttempts.filter(a => a.examId === selectedExamAttempts)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="آزمون‌های آنلاین و تستی"
        subtitle={`طراحی و تصحیح هوشمند آزمون‌های کلاسی و سراسری در ${currentSchool?.name}`}
        badge={`${toPersianDigits(exams.length)} آزمون`}
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>تعریف آزمون جدید</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map(ex => {
          const attempts = examAttempts.filter(a => a.examId === ex.id);
          return (
            <div key={ex.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {ex.courseName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    فعال
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-2 leading-snug">
                  {ex.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-500 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>مدت پاسخ‌گویی: <strong>{toPersianDigits(ex.durationMinutes)} دقیقه</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>تعداد سوالات: <strong>{toPersianDigits(ex.questions.length)} سوال</strong> (از {toPersianDigits(ex.totalPoints)} نمره)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>حد نصاب قبولی: <strong>{toPersianDigits(ex.passScore)} نمره</strong></span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <button
                  onClick={() => setSelectedExamAttempts(ex.id)}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>نتایج ({toPersianDigits(attempts.length)})</span>
                </button>

                <button
                  onClick={() => onStartExam(ex.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>ورود آزمایشی دانش‌آموز</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attempts Modal */}
      {selectedExamAttempts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-base">
                کارنامه و نتایج شرکت‌کنندگان در آزمون
              </h3>
              <button onClick={() => setSelectedExamAttempts(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {activeAttempts.map(att => (
                <div key={att.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">{att.studentName}</span>
                    <span className="text-[10px] text-slate-400">تاریخ: {toPersianDigits(att.completedAt || '')}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-teal-700 block">
                      {toPersianDigits(att.score ?? 0)} از {toPersianDigits(att.totalPossibleScore)}
                    </span>
                    <span className={`text-[10px] font-bold ${att.passed ? 'text-emerald-600' : 'text-red-500'}`}>
                      {att.passed ? 'قبول شده' : 'مردود'}
                    </span>
                  </div>
                </div>
              ))}

              {activeAttempts.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  هنوز دانش‌آموزی در این آزمون شرکت نکرده است.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-1">تعریف آزمون آنلاین جدید</h3>
            <p className="text-xs text-slate-500 mb-4">انتخاب سوالات از بانک تست و مشخصات برگزاری</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان آزمون *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: کوییز فصلی شیمی - پاییز ۱۴۰۳"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">درس مربوطه</label>
                  <select
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="شیمی ۱">شیمی ۱</option>
                    <option value="زیست‌شناسی ۱">زیست‌شناسی ۱</option>
                    <option value="ریاضی ۱">ریاضی ۱</option>
                    <option value="فیزیک ۱">فیزیک ۱</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">کلاس مخاطب</label>
                  <select
                    value={assignedClassId}
                    onChange={e => setAssignedClassId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مدت زمان (دقیقه)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">بارم کل نمره</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={totalPoints}
                    onChange={e => setTotalPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نمره قبولی</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={passScore}
                    onChange={e => setPassScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold"
                  />
                </div>
              </div>

              {/* Questions selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  انتخاب سوالات از بانک تست ({toPersianDigits(selectedQuestions.length)} سوال انتخاب شده):
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 p-2 rounded-xl bg-slate-50">
                  {questionBank.map(q => (
                    <label
                      key={q.id}
                      onClick={() => handleToggleQuestion(q.id)}
                      className={`p-2 rounded-lg border block cursor-pointer transition text-xs ${
                        selectedQuestions.includes(q.id)
                          ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(q.id)}
                          readOnly
                          className="accent-teal-600 w-4 h-4"
                        />
                        <span className="truncate">{q.questionText}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={selectedQuestions.length === 0}
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs disabled:opacity-50"
                >
                  انتشار آزمون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
