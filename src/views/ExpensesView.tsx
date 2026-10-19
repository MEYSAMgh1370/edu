import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, formatToman, getTodayJalali } from '../utils/jalali';
import {
  Receipt,
  Plus,
  TrendingDown,
  Building,
  Calendar,
  Tag
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, currentSchool } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('تجهیزات و آزمایشگاه');
  const [vendor, setVendor] = useState('');
  const [amountToman, setAmountToman] = useState(5000000);
  const [date, setDate] = useState(getTodayJalali());
  const [description, setDescription] = useState('');

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const categories = [
    'تجهیزات و آزمایشگاه',
    'فناوری و اینترنت',
    'چاپ و تکثیر',
    'تعمیرات و نگهداری ساختمان',
    'پذیرایی و رویدادها',
    'حق‌التدریس و پاداش'
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor.trim() || amountToman <= 0) return;

    addExpense({
      schoolId: currentSchool?.id || 'sch-1',
      category,
      vendor: vendor.trim(),
      amount: amountToman * 10,
      date,
      description: description.trim()
    });

    setIsModalOpen(false);
    setVendor('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="هزینه‌های جاری مدرسه"
        subtitle={`ثبت فاکتورها، تنخواه‌گردان و خریدهای ${currentSchool?.name}`}
        badge={`مجموع: ${formatToman(totalExpenses)}`}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت هزینه جدید</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">مجموع کل هزینه‌ها</span>
          <span className="text-2xl font-bold text-slate-800">{formatToman(totalExpenses)}</span>
          <span className="text-[11px] text-slate-400 block mt-1">{toPersianDigits(expenses.length)} فاکتور ثبت‌شده</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">بزرگ‌ترین سرفصل هزینه</span>
          <span className="text-base font-bold text-teal-800">تجهیزات و آزمایشگاه</span>
          <span className="text-[11px] text-slate-400 block mt-1">بیش از ۴۰٪ مصارف مدرسه</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">تعداد طرف‌های حساب و فروشگاه‌ها</span>
          <span className="text-2xl font-bold text-slate-800">{toPersianDigits(new Set(expenses.map(e => e.vendor)).size)}</span>
          <span className="text-[11px] text-slate-400 block mt-1">تأمین‌کننده معتبر</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">دسته‌بندی</th>
                <th className="py-3 px-4">فروشنده / طرف حساب</th>
                <th className="py-3 px-4">مبلغ فاکتور</th>
                <th className="py-3 px-4">تاریخ ثبت</th>
                <th className="py-3 px-4">شرح خرید</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {exp.vendor}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-rose-600">
                    {formatToman(exp.amount)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                    {toPersianDigits(exp.date)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    {exp.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">ثبت فاکتور هزینه جدید</h3>
            <p className="text-xs text-slate-500 mb-4">هزینه‌های جاری و سرمایه‌ای مدرسه</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">سرفصل هزینه *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">فروشنده / شرکت طرف حساب *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فروشگاه لوازم التحریر دانش"
                  value={vendor}
                  onChange={e => setVendor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مبلغ (تومان) *</label>
                  <input
                    type="number"
                    step="100000"
                    required
                    value={amountToman}
                    onChange={e => setAmountToman(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاریخ فاکتور</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات و شرح اقلام</label>
                <textarea
                  rows={3}
                  placeholder="اقلام خریداری‌شده، شماره فاکتور فیزیکی و غیره..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  ثبت هزینه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
