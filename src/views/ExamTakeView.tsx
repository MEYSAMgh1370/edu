import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ExamAttempt } from '../types';
import { toPersianDigits } from '../utils/jalali';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle
} from 'lucide-react';

interface ExamTakeViewProps {
  examId: string;
  onFinish: () => void;
}

export const ExamTakeView: React.FC<ExamTakeViewProps> = ({ examId, onFinish }) => {
  const { exams, questionBank, currentUser, submitExamAttempt } = useApp();

  const exam = exams.find(e => e.id === examId) || exams[0];
  const examQuestions = exam?.questions.map(eq => {
    const qData = questionBank.find(q => q.id === eq.questionId);
    return {
      ...eq,
      data: qData
    };
  }) || [];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState((exam?.durationMinutes || 20) * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<ExamAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmit = () => {
    if (isCompleted) return;
    setIsCompleted(true);
    const res = submitExamAttempt({
      examId: exam.id,
      studentId: currentUser?.id || 'st-demo',
      studentName: currentUser?.name || 'دانش‌آموز',
      startedAt: new Date().toLocaleTimeString('fa-IR'),
      answers,
      totalPossibleScore: exam.totalPoints
    });
    setAttemptResult(res);
  };

  const currentQ = examQuestions[currentQIndex];

  if (isCompleted && attemptResult) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
          attemptResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
        }`}>
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {attemptResult.passed ? 'تبریک! آزمون با موفقیت به پایان رسید' : 'آزمون پایان یافت'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            پاسخ‌های شما ثبت و نمره نهایی به صورت خودکار محاسبه گردید.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs text-slate-500">عنوان آزمون:</span>
            <span className="text-xs font-bold text-slate-800">{exam?.title}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs text-slate-500">نمره کسب شده:</span>
            <span className="text-lg font-bold text-teal-700">
              {toPersianDigits(attemptResult.score ?? 0)} از {toPersianDigits(attemptResult.totalPossibleScore)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs text-slate-500">وضعیت قبولی:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              attemptResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {attemptResult.passed ? 'پذیرفته شده (قبول)' : 'نیازمند تلاش مجدد (مردود)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>تعداد سوالات پاسخ داده شده:</span>
            <span>{toPersianDigits(Object.keys(answers).length)} از {toPersianDigits(examQuestions.length)}</span>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
        >
          بازگشت به پنل آزمون‌ها
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Test Header with live countdown */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800 text-sm sm:text-base">{exam?.title}</h2>
          <span className="text-xs text-slate-400">{exam?.courseName}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
            timeLeft < 300 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-teal-50 text-teal-800 border border-teal-200'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{toPersianDigits(formatTimer(timeLeft))}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            ثبت نهایی
          </button>
        </div>
      </div>

      {/* Question tracker navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-slate-400 shrink-0 ml-2">سؤالات:</span>
        {examQuestions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQIndex(idx)}
            className={`w-8 h-8 rounded-xl text-xs font-bold transition shrink-0 ${
              currentQIndex === idx
                ? 'bg-teal-600 text-white'
                : answers[q.questionId] !== undefined
                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {toPersianDigits(idx + 1)}
          </button>
        ))}
      </div>

      {/* Current Question Card */}
      {currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              سوال شماره {toPersianDigits(currentQIndex + 1)}
            </span>
            <span className="text-xs text-slate-400">
              بارم این سوال: {toPersianDigits(currentQ.points)} نمره
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
            {currentQ.data?.questionText || 'صورت سوال در دسترس نیست'}
          </h3>

          {/* Options Radio List */}
          <div className="space-y-3 pt-2">
            {currentQ.data?.options?.map((opt, optIdx) => {
              const isSelected = answers[currentQ.questionId] === optIdx;
              return (
                <label
                  key={optIdx}
                  onClick={() => handleSelectAnswer(currentQ.questionId, optIdx)}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition text-xs sm:text-sm ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 text-teal-900 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="font-bold text-slate-400 text-xs">({toPersianDigits(optIdx + 1)})</span>
                  <span className="leading-relaxed">{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Question bottom navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => prev - 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4" />
              <span>سوال قبلی</span>
            </button>

            {currentQIndex < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                <span>سوال بعدی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>پایان و تحویل آزمون</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
