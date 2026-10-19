import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, getTodayJalali } from '../utils/jalali';
import {
  FileText,
  Plus,
  Printer,
  BookOpen,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface QuestionBoxViewProps {
  onPrintSheet: (sheetId: string) => void;
}

export const QuestionBoxView: React.FC<QuestionBoxViewProps> = ({ onPrintSheet }) => {
  const { questionBoxItems, questionSheets, addQuestionBoxItem, createQuestionSheet, currentSchool, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'BOX' | 'SHEETS'>('BOX');
  const [isAddBoxItemModalOpen, setIsAddBoxItemModalOpen] = useState(false);
  const [isCreateSheetModalOpen, setIsCreateSheetModalOpen] = useState(false);

  // Box Item form
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('شیمی ۱');
  const [qType, setQType] = useState<'MULTIPLE_CHOICE' | 'ESSAY'>('ESSAY');
  const [text, setText] = useState('');
  const [score, setScore] = useState(2.0);

  // Sheet form
  const [sheetTitle, setSheetTitle] = useState('');
  const [sheetCourse, setSheetCourse] = useState('شیمی ۱');
  const [sheetGrade, setSheetGrade] = useState('دهم علوم تجربی');
  const [sheetDuration, setSheetDuration] = useState(45);

  const handleCreateBoxItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    addQuestionBoxItem({
      schoolId: currentSchool?.id || 'sch-1',
      teacherId: currentUser?.id || 'u-2',
      teacherName: currentUser?.name || 'دبیر',
      title: title.trim(),
      courseName,
      type: qType,
      text: text.trim(),
      score
    });

    setIsAddBoxItemModalOpen(false);
    setTitle('');
    setText('');
  };

  const handleCreateSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetTitle.trim()) return;

    createQuestionSheet({
      schoolId: currentSchool?.id || 'sch-1',
      title: sheetTitle.trim(),
      headerDetails: {
        schoolName: currentSchool?.name || 'دبیرستان رشدِ اندیشه',
        courseName: sheetCourse,
        gradeTitle: sheetGrade,
        date: getTodayJalali(),
        durationMinutes: sheetDuration,
        teacherName: currentUser?.name || 'استاد رضایی'
      },
      questions: questionBoxItems.map(item => ({
        text: item.text,
        type: item.type,
        score: item.score
      }))
    });

    setIsCreateSheetModalOpen(false);
    setSheetTitle('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="باکس سؤالات و برگه‌های چاپی"
        subtitle="آرشیو سوالات تشریحی و تستی اساتید جهت تنظیم برگه‌های امتحانی چاپی"
        badge={`${toPersianDigits(questionBoxItems.length)} سوال در باکس`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddBoxItemModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              <span>طراحی سوال برای باکس</span>
            </button>
            <button
              onClick={() => setIsCreateSheetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
            >
              <FileText className="w-4 h-4" />
              <span>ساخت برگه امتحانی چاپی</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('BOX')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'BOX'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>آرشیو سوالات در باکس</span>
        </button>

        <button
          onClick={() => setActiveTab('SHEETS')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'SHEETS'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>برگه‌های امتحانی آماده چاپ ({toPersianDigits(questionSheets.length)})</span>
        </button>
      </div>

      {activeTab === 'BOX' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionBoxItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {item.courseName}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    بارم: {toPersianDigits(item.score)} نمره
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                  {item.text}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
                <span>طراح: {item.teacherName}</span>
                <span>ثبت: {toPersianDigits(item.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'SHEETS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionSheets.map(sheet => (
            <div key={sheet.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {sheet.headerDetails.courseName} • {sheet.headerDetails.gradeTitle}
                  </span>
                  <span className="text-xs text-slate-400">
                    {toPersianDigits(sheet.headerDetails.durationMinutes)} دقیقه
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-base mb-2">{sheet.title}</h3>
                <p className="text-xs text-slate-500 mb-4">
                  برگه امتحانی آماده شامل {toPersianDigits(sheet.questions.length)} سوال تشریحی و تستی به همراه سربرگ رسمی وزارت آموزش و پرورش.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">تاریخ: {toPersianDigits(sheet.headerDetails.date)}</span>
                <button
                  onClick={() => onPrintSheet(sheet.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>پیش‌نمایش و چاپ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Box Item Modal */}
      {isAddBoxItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">طراحی سوال برای باکس</h3>
            <p className="text-xs text-slate-500 mb-4">سوالات تشریحی یا تحلیلی برای برگه‌های امتحانی</p>

            <form onSubmit={handleCreateBoxItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان کوتاه سوال *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سوال محاسبه استوکیومتری"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">بارم نمره</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="20"
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">متن کامل سوال *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="متن کامل سوال را بنویسید..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBoxItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  افزودن به باکس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Sheet Modal */}
      {isCreateSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">ساخت برگه امتحانی چاپی</h3>
            <p className="text-xs text-slate-500 mb-4">تنظیم مشخصات سربرگ برگه امتحان</p>

            <form onSubmit={handleCreateSheet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان آزمون *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: برگه آزمون نوبت اول شیمی دهم"
                  value={sheetTitle}
                  onChange={e => setSheetTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">درس مربوطه</label>
                  <input
                    type="text"
                    value={sheetCourse}
                    onChange={e => setSheetCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">پایه و رشته</label>
                  <input
                    type="text"
                    value={sheetGrade}
                    onChange={e => setSheetGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مدت زمان آزمون (دقیقه)</label>
                <input
                  type="number"
                  value={sheetDuration}
                  onChange={e => setSheetDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold"
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                کلیه سؤالات موجود در باکس دبیرستان در این برگه چاپی درج خواهند شد.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateSheetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  ایجاد برگه چاپی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
