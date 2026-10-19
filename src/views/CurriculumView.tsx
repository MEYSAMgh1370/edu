import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import {
  Layers,
  HelpCircle,
  Plus,
  BookOpen,
  Filter,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

export const CurriculumView: React.FC = () => {
  const { topics, questionBank, addTopic, addQuestion, currentUser } = useApp();

  const [selectedCourse, setSelectedCourse] = useState('شیمی ۱');
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  // Topic form
  const [topicTitle, setTopicTitle] = useState('');
  const [topicGrade, setTopicGrade] = useState(10);

  // Question form
  const [qTopicId, setQTopicId] = useState(topics[0]?.id || '');
  const [qText, setQText] = useState('');
  const [qDifficulty, setQDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  const filteredTopics = topics.filter(t => t.courseName === selectedCourse);
  const filteredQuestions = questionBank.filter(q => q.courseName === selectedCourse);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;
    addTopic(topicTitle.trim(), selectedCourse, topicGrade);
    setIsAddTopicModalOpen(false);
    setTopicTitle('');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !opt1.trim() || !opt2.trim()) return;

    const currentTop = topics.find(t => t.id === qTopicId);

    addQuestion({
      topicId: qTopicId || topics[0]?.id || 'top-1',
      topicTitle: currentTop?.title || 'فصل عمومی',
      courseName: selectedCourse,
      gradeLevel: currentTop?.gradeLevel || 10,
      type: 'MULTIPLE_CHOICE',
      questionText: qText.trim(),
      difficulty: qDifficulty,
      options: [opt1.trim(), opt2.trim(), opt3.trim(), opt4.trim()],
      correctOptionIndex: correctIdx,
      explanation: explanation.trim(),
      authorName: currentUser?.name || 'دبیر'
    });

    setIsAddQuestionModalOpen(false);
    setQText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setExplanation('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="بانک سؤالات و سرفصل‌های درسی"
        subtitle="مدیریت درخت مباحث درسی و آرشیو تست‌ها و سؤالات چهارگزینه‌ای"
        badge={`${toPersianDigits(questionBank.length)} سؤال در بانک`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddTopicModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن فصل / سرفصل</span>
            </button>
            <button
              onClick={() => setIsAddQuestionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
            >
              <HelpCircle className="w-4 h-4" />
              <span>طراحی تست جدید</span>
            </button>
          </div>
        }
      />

      {/* Course filter buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 shrink-0 ml-2">انتخاب درس:</span>
        {['شیمی ۱', 'زیست‌شناسی ۱', 'ریاضی ۱', 'فیزیک ۱'].map(cr => (
          <button
            key={cr}
            onClick={() => setSelectedCourse(cr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
              selectedCourse === cr ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cr}
          </button>
        ))}
      </div>

      {/* Two columns: Topics List and Questions List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Tree Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>سرفصل‌ها و مباحث {selectedCourse}</span>
            </h3>
            <span className="text-xs text-slate-400">{toPersianDigits(filteredTopics.length)} فصل</span>
          </div>

          <div className="space-y-2">
            {filteredTopics.map((top, idx) => (
              <div key={top.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {toPersianDigits(idx + 1)}
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800">{top.title}</h4>
                    <span className="text-[10px] text-slate-400">پایه {toPersianDigits(top.gradeLevel)}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                هنوز فصلی برای این درس ثبت نشده است.
              </div>
            )}
          </div>
        </div>

        {/* Questions Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>بانک تست‌های درس {selectedCourse}</span>
            </h3>
            <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              {toPersianDigits(filteredQuestions.length)} تست موجود
            </span>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, qIdx) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                      سؤال {toPersianDigits(qIdx + 1)}
                    </span>
                    <span className="text-xs text-slate-400">{q.topicTitle}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    q.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    q.difficulty === 'MEDIUM' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {q.difficulty === 'EASY' ? 'آسان' : q.difficulty === 'MEDIUM' ? 'متوسط' : 'دشوار'}
                  </span>
                </div>

                <p className="text-slate-800 text-sm font-medium mb-4 leading-relaxed">
                  {q.questionText}
                </p>

                {/* 4 Choices */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                          optIdx === q.correctOptionIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                          optIdx === q.correctOptionIndex ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {toPersianDigits(optIdx + 1)}
                        </span>
                        <span>{opt}</span>
                        {optIdx === q.correctOptionIndex && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {q.explanation && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <strong className="block mb-0.5 text-amber-800">پاسخ تشریحی:</strong>
                    <span>{q.explanation}</span>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  طراح: {q.authorName}
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">
                هنوز سؤالی برای این درس ثبت نشده است. از دکمه «طراحی تست جدید» استفاده کنید.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">افزودن سرفصل جدید</h3>
            <p className="text-xs text-slate-500 mb-4">برای درس {selectedCourse}</p>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان فصل یا مبحث *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فصل ۳: ساختار اتم و جدول تناوبی"
                  value={topicTitle}
                  onChange={e => setTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">پایه تحصیلی</label>
                <select
                  value={topicGrade}
                  onChange={e => setTopicGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  {[7, 8, 9, 10, 11, 12].map(g => (
                    <option key={g} value={g}>پایه {toPersianDigits(g)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  ثبت سرفصل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {isAddQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-1">طراحی تست چهارگزینه‌ای</h3>
            <p className="text-xs text-slate-500 mb-4">درس {selectedCourse}</p>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مبحث مربوطه *</label>
                  <select
                    value={qTopicId}
                    onChange={e => setQTopicId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {filteredTopics.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">سطح دشواری</label>
                  <select
                    value={qDifficulty}
                    onChange={e => setQDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="EASY">آسان</option>
                    <option value="MEDIUM">متوسط</option>
                    <option value="HARD">دشوار / کنکوری</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">صورت سؤال *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="متن کامل سؤال را اینجا بنویسید..."
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">گزینه‌ها و انتخاب پاسخ صحیح:</label>
                {[
                  { val: opt1, set: setOpt1, idx: 0, label: 'گزینه ۱' },
                  { val: opt2, set: setOpt2, idx: 1, label: 'گزینه ۲' },
                  { val: opt3, set: setOpt3, idx: 2, label: 'گزینه ۳' },
                  { val: opt4, set: setOpt4, idx: 3, label: 'گزینه ۴' },
                ].map(opt => (
                  <div key={opt.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === opt.idx}
                      onChange={() => setCorrectIdx(opt.idx)}
                      className="accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <input
                      type="text"
                      required={opt.idx < 2}
                      placeholder={opt.label}
                      value={opt.val}
                      onChange={e => opt.set(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">پاسخ تشریحی و راهنما</label>
                <textarea
                  rows={2}
                  placeholder="توضیح کوتاه در مورد علت صحیح بودن گزینه..."
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddQuestionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  افزودن به بانک سؤالات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
