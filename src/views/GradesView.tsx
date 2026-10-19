import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GradeTerm } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import {
  Award,
  Save,
  Check,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const GradesView: React.FC = () => {
  const { classes, students, grades, saveGrade, currentSchool } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<GradeTerm>('CONTINUOUS_1');
  const [selectedCourse, setSelectedCourse] = useState('شیمی ۱');
  const [notification, setNotification] = useState<string | null>(null);

  // Local draft scores
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});

  const termsList: { code: GradeTerm; label: string }[] = [
    { code: 'CONTINUOUS_1', label: 'مستمر نوبت اول' },
    { code: 'TERM_1', label: 'پایانی نوبت اول' },
    { code: 'CONTINUOUS_2', label: 'مستمر نوبت دوم' },
    { code: 'TERM_2', label: 'پایانی نوبت دوم' },
  ];

  const coursesList = ['شیمی ۱', 'زیست‌شناسی ۱', 'ریاضی ۱', 'فیزیک ۱', 'فارسی و نگارش', 'دین و زندگی'];

  const classStudents = students.filter(st => st.classId === selectedClassId);

  const getStudentGrade = (studentId: string) => {
    return grades.find(g =>
      g.studentId === studentId &&
      g.courseName === selectedCourse &&
      g.term === selectedTerm &&
      g.academicYear === (currentSchool?.currentAcademicYear || '1403-1404')
    );
  };

  const handleScoreChange = (studentId: string, val: string) => {
    setScoreInputs(prev => ({ ...prev, [studentId]: val }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    let savedCount = 0;

    classStudents.forEach(st => {
      const existing = getStudentGrade(st.id);
      const inputVal = scoreInputs[st.id] !== undefined ? scoreInputs[st.id] : (existing?.score?.toString() || '');
      if (inputVal !== '') {
        const numScore = parseFloat(inputVal);
        if (!isNaN(numScore) && numScore >= 0 && numScore <= 20) {
          saveGrade({
            schoolId: currentSchool?.id || 'sch-1',
            studentId: st.id,
            studentName: st.name,
            classId: st.classId,
            courseId: `cr-${selectedCourse}`,
            courseName: selectedCourse,
            academicYear: currentSchool?.currentAcademicYear || '1403-1404',
            term: selectedTerm,
            score: numScore,
            descriptive: numScore >= 18 ? 'EXCELLENT' : numScore >= 14 ? 'VERY_GOOD' : numScore >= 10 ? 'GOOD' : 'NEEDS_EFFORT'
          });
          savedCount++;
        }
      }
    });

    setNotification(`نمرات ${toPersianDigits(savedCount)} دانش‌آموز در سامانه با موفقیت ثبت و ذخیره شد.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="دفتر ثبت نمرات و کارنامه"
        subtitle={`ثبت نمرات مستمر و پایانی دروس در ${currentSchool?.name}`}
        badge={`سال ${toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}`}
        actions={
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره نمرات کلاس</span>
          </button>
        }
      />

      {notification && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-teal-600 hover:text-teal-900 font-bold">✕</button>
        </div>
      )}

      {/* Roster selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>انتخاب کلاس درس:</span>
          </label>
          <select
            value={selectedClassId}
            onChange={e => {
              setSelectedClassId(e.target.value);
              setScoreInputs({});
            }}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} (پایه {toPersianDigits(c.gradeLevel)})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>درس مربوطه:</span>
          </label>
          <select
            value={selectedCourse}
            onChange={e => {
              setSelectedCourse(e.target.value);
              setScoreInputs({});
            }}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
          >
            {coursesList.map(cr => (
              <option key={cr} value={cr}>{cr}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">نوبت تحصیلی:</label>
          <select
            value={selectedTerm}
            onChange={e => {
              setSelectedTerm(e.target.value as GradeTerm);
              setScoreInputs({});
            }}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
          >
            {termsList.map(t => (
              <option key={t.code} value={t.code}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              لیست نمرات: {selectedCourse} • {termsList.find(t => t.code === selectedTerm)?.label}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {toPersianDigits(classStudents.length)} دانش‌آموز در لیست
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">ردیف</th>
                <th className="py-3 px-4">نام و نام خانوادگی</th>
                <th className="py-3 px-4">کد ملی</th>
                <th className="py-3 px-4 w-36">نمره از ۲۰</th>
                <th className="py-3 px-4">ارزیابی توصیفی</th>
                <th className="py-3 px-4">تاریخ آخرین ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st, idx) => {
                const recorded = getStudentGrade(st.id);
                const currentVal = scoreInputs[st.id] !== undefined ? scoreInputs[st.id] : (recorded?.score?.toString() || '');
                const numScore = parseFloat(currentVal);

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
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          placeholder="۰ تا ۲۰"
                          value={currentVal}
                          onChange={e => handleScoreChange(st.id, e.target.value)}
                          className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 text-center font-bold text-teal-800 bg-white"
                          dir="ltr"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {!isNaN(numScore) ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          numScore >= 18 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          numScore >= 14 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          numScore >= 10 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {numScore >= 18 ? 'خیلی خوب' : numScore >= 14 ? 'خوب' : numScore >= 10 ? 'قابل قبول' : 'نیازمند تلاش'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">ثبت نشده</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {recorded ? toPersianDigits(recorded.updatedAt) : '---'}
                    </td>
                  </tr>
                );
              })}

              {classStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    هیچ دانش‌آموزی در این کلاس ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            برای ثبت نهایی، روی دکمه ذخیره نمرات کلیک کنید.
          </span>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>ذخیره کلیه نمرات این صفحه</span>
          </button>
        </div>
      </div>
    </div>
  );
};
