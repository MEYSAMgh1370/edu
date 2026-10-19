import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits } from '../utils/jalali';
import {
  Settings,
  Calendar,
  Bot,
  Bell,
  Save,
  CheckCircle2,
  Shield,
  Clock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentSchool, updateSchoolSettings } = useApp();

  const [name, setName] = useState(currentSchool?.name || '');
  const [currentAcademicYear, setCurrentAcademicYear] = useState(currentSchool?.currentAcademicYear || '1403-1404');
  const [weekStart, setWeekStart] = useState<'SATURDAY' | 'MONDAY'>(currentSchool?.weekStart || 'SATURDAY');
  const [autoPromotion, setAutoPromotion] = useState(currentSchool?.autoPromotionEnabled || false);
  const [baleBotEnabled, setBaleBotEnabled] = useState(currentSchool?.baleBotEnabled || false);
  const [baleBotToken, setBaleBotToken] = useState(currentSchool?.baleBotToken || '');
  const [phone, setPhone] = useState(currentSchool?.phone || '');
  const [address, setAddress] = useState(currentSchool?.address || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({
      name,
      currentAcademicYear,
      weekStart,
      autoPromotionEnabled: autoPromotion,
      baleBotEnabled,
      baleBotToken,
      phone,
      address
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="تنظیمات کلی مدرسه"
        subtitle={`مدیریت سال تحصیلی، تقویم و اتصالات پیام‌رسان بله در ${currentSchool?.name}`}
      />

      {savedNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>تنظیمات مدرسه با موفقیت بروزرسانی شد.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic School Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-4 h-4 text-teal-600" />
            <span>مشخصات و هویت مدرسه</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نام رسمی مدرسه</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">شماره تماس آموزشگاه</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">نشانی پستی مدرسه</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Academic Calendar and Week start */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>سال تحصیلی و تقویم کاری</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">سال تحصیلی جاری فعال</label>
              <select
                value={currentAcademicYear}
                onChange={e => setCurrentAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
              >
                <option value="1403-1404">سال تحصیلی ۱۴۰۳-۱۴۰۴ (فعال)</option>
                <option value="1404-1405">سال تحصیلی ۱۴۰۴-۱۴۰۵ (آتی)</option>
                <option value="1402-1403">سال تحصیلی ۱۴۰۲-۱۴۰۳ (بایگانی)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">آغاز هفته آموزشی</label>
              <select
                value={weekStart}
                onChange={e => setWeekStart(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white"
              >
                <option value="SATURDAY">شنبه (تقویم آموزشی رسمی ایران)</option>
                <option value="MONDAY">دوشنبه (مدارس بین‌المللی)</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoPromotion}
              onChange={e => setAutoPromotion(e.target.checked)}
              className="accent-teal-600 w-4 h-4"
            />
            <span className="text-xs text-slate-700 font-medium">
              فعال‌سازی ارتقای پایه خودکار دانش‌آموزان در پایان سال تحصیلی
            </span>
          </label>
        </div>

        {/* Bale Bot Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bot className="w-4 h-4 text-teal-600" />
            <span>ربات هوشمند پیام‌رسان بله (Bale Bot)</span>
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            با اتصال ربات بله، اولیا و دانش‌آموزان می‌توانند وضعیت غیبت‌های روزانه، نمرات و یادآوری رویدادها را به صورت مستقیم در پیام‌رسان دریافت نمایند.
          </p>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={baleBotEnabled}
              onChange={e => setBaleBotEnabled(e.target.checked)}
              className="accent-teal-600 w-4 h-4"
            />
            <span className="text-xs text-slate-800 font-bold">
              فعال‌سازی ربات بله برای این مدرسه
            </span>
          </label>

          {baleBotEnabled && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">توکن ربات بازوی بله (Bot Token) *</label>
              <input
                type="text"
                placeholder="bot123456:AAG..."
                value={baleBotToken}
                onChange={e => setBaleBotToken(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                dir="ltr"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات تنظیمات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
