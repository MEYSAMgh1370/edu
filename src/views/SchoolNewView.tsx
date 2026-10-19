import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { School } from '../types';
import {
  Building2,
  Calendar,
  Check,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface SchoolNewViewProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SchoolNewView: React.FC<SchoolNewViewProps> = ({ onSuccess, onCancel }) => {
  const { createSchool } = useApp();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [level, setLevel] = useState<'UPPER_SECONDARY' | 'LOWER_SECONDARY' | 'ELEMENTARY'>('UPPER_SECONDARY');
  const [weekStart, setWeekStart] = useState<'SATURDAY' | 'MONDAY'>('SATURDAY');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w\-]/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createSchool({
      name: name.trim(),
      slug: slug.trim() || `school-${Date.now().toString(36)}`,
      level,
      weekStart,
      phone: phone.trim(),
      address: address.trim()
    });

    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="ثبت و تأسیس مدرسه جدید"
        subtitle="شما پس از ثبت، به عنوان مدیر ارشد این مدرسه تعیین خواهید شد."
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">نام رسمی مدرسه یا مجتمع آموزشی *</label>
            <input
              type="text"
              required
              placeholder="مثال: دبیرستان اندیشه نو"
              value={name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">دوره تحصیلی مدرسه *</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
              >
                <option value="UPPER_SECONDARY">متوسطه دوم (پایه‌های ۱۰ تا ۱۲)</option>
                <option value="LOWER_SECONDARY">متوسطه اول (پایه‌های ۷ تا ۹)</option>
                <option value="ELEMENTARY">دبستان (پایه‌های ۱ تا ۶)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">دوره تحصیلی پس از ثبت غیرقابل تغییر است.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">شناسه یکتای آدرس وب (Slug) *</label>
              <input
                type="text"
                required
                placeholder="andishe-no"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 font-mono"
                dir="ltr"
              />
              <span className="text-[10px] text-slate-400 mt-1 block" dir="ltr">/s/{slug || 'school-slug'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">شماره تلفن مدرسه</label>
              <input
                type="text"
                placeholder="۰۲۱-۸۸۰۰۰۰۰۰"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نشانی آموزشگاه</label>
              <input
                type="text"
                placeholder="استان، شهر، خیابان..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Advanced Collapsible */}
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50">
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full text-right text-xs font-bold text-slate-600 flex items-center justify-between"
            >
              <span>تنظیمات پیشرفته تقویم و منطقه زمانی</span>
              <span className="text-teal-600">{advancedOpen ? '▲ بستن' : '▼ نمایش'}</span>
            </button>

            {advancedOpen && (
              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">آغاز هفته کاری:</label>
                  <select
                    value={weekStart}
                    onChange={e => setWeekStart(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="SATURDAY">شنبه (تقویم رسمی ایران)</option>
                    <option value="MONDAY">دوشنبه (مدارس بین‌المللی)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">منطقه زمانی:</label>
                  <div className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 font-mono">
                    Asia/Tehran (+03:30)
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
            >
              ثبت و ایجاد مدرسه
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
