import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import {
  ArrowUpCircle,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Users
} from 'lucide-react';

export const PromotionView: React.FC = () => {
  const { students, runPromotion, currentSchool } = useApp();

  const [result, setResult] = useState<{ promotedCount: number; graduatedCount: number } | null>(null);

  const grade12Count = students.filter(s => s.gradeLevel === 12).length;
  const under12Count = students.filter(s => s.gradeLevel < 12).length;

  const handleRun = () => {
    if (window.confirm('آیا از اجرای عملیات ارتقای پایه کلیه دانش‌آموزان به سال تحصیلی بعد اطمینان دارید؟')) {
      const res = runPromotion();
      setResult(res);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="ارتقای پایه سالانه دانش‌آموزان"
        subtitle={`عملیات پایان سال تحصیلی و ارتقا به پایه بالاتر در ${currentSchool?.name}`}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>توجه مهم:</strong> با اجرای این فرآیند، پایه‌های دهم به یازدهم و یازدهم به دوازدهم ارتقا یافته و دانش‌آموزان پایه دوازدهم به عنوان فارغ‌التحصیل ثبت خواهند شد. سوابق تحصیلی سال‌های گذشته کماکان در بایگانی امن باقی خواهد ماند.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-center">
            <span className="text-xs text-slate-500 block mb-1">دانش‌آموزان مشمول ارتقای پایه</span>
            <span className="text-2xl font-bold text-teal-700">{toPersianDigits(under12Count)} نفر</span>
            <span className="text-[11px] text-slate-400 block mt-1">پایه‌های دهم و یازدهم</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-center">
            <span className="text-xs text-slate-500 block mb-1">فارغ‌التحصیلان دوازدهم</span>
            <span className="text-2xl font-bold text-purple-700">{toPersianDigits(grade12Count)} نفر</span>
            <span className="text-[11px] text-slate-400 block mt-1">صدور گواهی پایان تحصیل</span>
          </div>
        </div>

        {result && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              عملیات ارتقای سالانه انجام شد: {toPersianDigits(result.promotedCount)} دانش‌آموز به پایه بالاتر ارتقا یافتند و {toPersianDigits(result.graduatedCount)} نفر فارغ‌التحصیل شدند.
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleRun}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>اجرای عملیات ارتقای سالانه</span>
          </button>
        </div>
      </div>
    </div>
  );
};
