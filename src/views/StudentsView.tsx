import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import {
  GraduationCap,
  UserPlus,
  Search,
  Users,
  Phone,
  Filter
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { students, classes, addStudent, currentSchool } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const filteredStudents = students.filter(st => {
    if (classFilter !== 'ALL' && st.classId !== classFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = st.name.toLowerCase().includes(q);
      const matchCode = st.nationalCode.includes(q);
      if (!matchName && !matchCode) return false;
    }
    return true;
  });

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nationalCode.trim() || !classId) return;

    addStudent(name.trim(), nationalCode.trim(), classId, guardianName.trim(), guardianPhone.trim());
    setIsModalOpen(false);
    setName('');
    setNationalCode('');
    setGuardianName('');
    setGuardianPhone('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="دانش‌آموزان و اولیا"
        subtitle={`پرونده دانش‌آموزان ثبت‌نامی در ${currentSchool?.name}`}
        badge={`${toPersianDigits(students.length)} دانش‌آموز`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت‌نام دانش‌آموز جدید</span>
          </button>
        }
      />

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="جستجوی نام دانش‌آموز یا کدملی..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
          >
            <option value="ALL">همه کلاس‌ها ({toPersianDigits(students.length)})</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">نام دانش‌آموز</th>
                <th className="py-3 px-4">کد ملی</th>
                <th className="py-3 px-4">کلاس و پایه</th>
                <th className="py-3 px-4">ولی / سرپرست قانونی</th>
                <th className="py-3 px-4">شماره تماس ولی</th>
                <th className="py-3 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(st => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-800">{st.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {toPersianDigits(st.nationalCode)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {st.className}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    {st.guardians[0]?.guardianName ? (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{st.guardians[0].guardianName}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">ثبت نشده</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono" dir="ltr">
                    {st.guardians[0]?.guardianPhone ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{toPersianDigits(st.guardians[0].guardianPhone)}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-sans">---</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      مشغول به تحصیل
                    </span>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    دانش‌آموزی با این مشخصات یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">ثبت‌نام دانش‌آموز در مدرسه</h3>
            <p className="text-xs text-slate-500 mb-5">
              اطلاعات هویتی دانش‌آموز و سرپرست قانونی را وارد نمایید.
            </p>

            <form onSubmit={handleEnroll} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی دانش‌آموز *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: پارسا صادقی"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">کد ملی ده‌رقمی *</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="0012345678"
                  value={nationalCode}
                  onChange={e => setNationalCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">کلاس تخصیص داده شده *</label>
                <select
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (پایه {c.gradeLevel})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-600 block">اطلاعات ولی / سرپرست:</span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">نام ولی</label>
                  <input
                    type="text"
                    placeholder="مثال: پدر یا مادر دانش‌آموز"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">شماره همراه ولی</label>
                  <input
                    type="text"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={guardianPhone}
                    onChange={e => setGuardianPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                    dir="ltr"
                  />
                </div>
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
                  ثبت پرونده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
