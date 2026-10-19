import React from 'react';
import { useApp } from '../context/AppContext';
import { toPersianDigits, getTodayJalali } from '../utils/jalali';
import { Printer, ArrowRight } from 'lucide-react';

interface AttendanceSheetPrintViewProps {
  onBack: () => void;
}

export const AttendanceSheetPrintView: React.FC<AttendanceSheetPrintViewProps> = ({ onBack }) => {
  const { currentSchool, classes, students } = useApp();
  const selectedClass = classes[0];
  const classStudents = students.filter(s => s.classId === selectedClass?.id);

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
          <span>بازگشت به دفتر حضور و غیاب</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>چاپ برگه رسمی (Print / PDF)</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <span className="text-xs font-bold block mb-1">بسمه تعالی</span>
          <h1 className="text-lg font-bold mb-2">دفتر رسمی حضور و غیاب و انضباطی کلاسی</h1>
          <div className="flex items-center justify-between text-xs font-semibold px-4">
            <span>مدرسه: <strong>{currentSchool?.name}</strong></span>
            <span>کلاس: <strong>{selectedClass?.name}</strong></span>
            <span>سال تحصیلی: <strong>{toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}</strong></span>
            <span>تاریخ: <strong>{toPersianDigits(getTodayJalali())}</strong></span>
          </div>
        </div>

        {/* Attendance Grid */}
        <table className="w-full text-right border-collapse border border-slate-400 text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 p-2 text-center w-10">ردیف</th>
              <th className="border border-slate-400 p-2">نام و نام خانوادگی دانش‌آموز</th>
              <th className="border border-slate-400 p-2 text-center w-28">کد ملی</th>
              <th className="border border-slate-400 p-2 text-center w-16">حاضر</th>
              <th className="border border-slate-400 p-2 text-center w-16">غایب</th>
              <th className="border border-slate-400 p-2 text-center w-16">تاخیر</th>
              <th className="border border-slate-400 p-2">توضیحات و علت غیبت</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map((st, i) => (
              <tr key={st.id} className="h-10">
                <td className="border border-slate-400 p-2 text-center font-mono">{toPersianDigits(i + 1)}</td>
                <td className="border border-slate-400 p-2 font-semibold">{st.name}</td>
                <td className="border border-slate-400 p-2 text-center font-mono">{toPersianDigits(st.nationalCode)}</td>
                <td className="border border-slate-400 p-2 text-center"></td>
                <td className="border border-slate-400 p-2 text-center"></td>
                <td className="border border-slate-400 p-2 text-center"></td>
                <td className="border border-slate-400 p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-12 flex items-center justify-between text-xs font-bold pt-8 border-t border-slate-200">
          <div>امضای دبیر / آموزگار مربوطه: .......................</div>
          <div>امضای معاون آموزشی: .......................</div>
          <div>مهر و امضای مدیر مدرسه: .......................</div>
        </div>
      </div>
    </div>
  );
};
