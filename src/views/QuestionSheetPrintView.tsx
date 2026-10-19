import React from 'react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/jalali';
import { Printer, ArrowRight } from 'lucide-react';

interface QuestionSheetPrintViewProps {
  sheetId: string;
  onBack: () => void;
}

export const QuestionSheetPrintView: React.FC<QuestionSheetPrintViewProps> = ({ sheetId, onBack }) => {
  const { questionSheets, currentSchool } = useApp();
  const sheet = questionSheets.find(s => s.id === sheetId) || questionSheets[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top action bar - hidden during print */}
      <div className="print:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به باکس سؤالات</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>چاپ برگه امتحان (Print / PDF)</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* Ministry style header box */}
        <div className="border-2 border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between border-b border-slate-400 pb-3 mb-3 text-xs">
            <div>
              <span>نام و نام خانوادگی: .............................</span>
            </div>
            <div className="text-center font-bold">
              <span>بسمه تعالی</span>
              <h2 className="text-sm font-bold mt-0.5">{sheet?.headerDetails?.schoolName || currentSchool?.name}</h2>
              <span className="text-[11px] font-normal block">{sheet?.title}</span>
            </div>
            <div className="text-left space-y-1">
              <div>تاریخ آزمون: {toPersianDigits(sheet?.headerDetails?.date || '')}</div>
              <div>مدت آزمون: {toPersianDigits(sheet?.headerDetails?.durationMinutes || 45)} دقیقه</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold px-2">
            <span>نام درس: <strong>{sheet?.headerDetails?.courseName}</strong></span>
            <span>پایه و رشته: <strong>{sheet?.headerDetails?.gradeTitle}</strong></span>
            <span>نام دبیر: <strong>{sheet?.headerDetails?.teacherName}</strong></span>
            <span>تعداد صفحه: ۱</span>
          </div>
        </div>

        {/* Questions list with scores */}
        <div className="space-y-6">
          {sheet?.questions.map((q, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 last:border-b-0">
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-xs shrink-0 mt-0.5">{toPersianDigits(idx + 1)}-</span>
                  <p className="text-xs sm:text-sm leading-relaxed">{q.text}</p>
                </div>

                {q.type === 'MULTIPLE_CHOICE' && q.options && (
                  <div className="grid grid-cols-2 gap-3 mt-3 pr-5 text-xs">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-1.5">
                        <span className="font-bold">({toPersianDigits(oIdx + 1)})</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-16 h-8 border border-slate-400 rounded flex items-center justify-center text-xs font-bold shrink-0 bg-slate-50">
                {toPersianDigits(q.score)} نمره
              </div>
            </div>
          ))}
        </div>

        {/* Footer Score and Signature Box */}
        <div className="mt-16 pt-6 border-t-2 border-slate-800 flex items-center justify-between text-xs font-bold">
          <div>نمره به عدد: ................</div>
          <div>نمره به حروف: .......................................</div>
          <div>محل امضای مصحح: .............................</div>
        </div>
      </div>
    </div>
  );
};
