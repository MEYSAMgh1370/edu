import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ShieldCheck, Plus, Check } from 'lucide-react';

export const RolesView: React.FC = () => {
  const { roles, createCustomRole } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const availablePermissions = [
    { id: 'CLASS_MANAGE', label: 'مدیریت کلاس‌ها و دانش‌آموزان' },
    { id: 'GRADE_MANAGE', label: 'ثبت و ویرایش نمرات' },
    { id: 'ATTENDANCE_MANAGE', label: 'ثبت و بررسی حضور و غیاب' },
    { id: 'TIMETABLE_MANAGE', label: 'ویرایش برنامه کلاسی هفتگی' },
    { id: 'CURRICULUM_MANAGE', label: 'مدیریت سرفصل‌ها و بانک سؤالات' },
    { id: 'EXAM_MANAGE', label: 'طراحی و تصحیح آزمون‌های آنلاین' },
    { id: 'QUESTION_BOX_MANAGE', label: 'طراحی برگه امتحانی و باکس سؤالات' },
    { id: 'FINANCE_VIEW_ALL', label: 'مشاهده شهریه و وضعیت مالی کلیه دانش‌آموزان' },
    { id: 'FINANCE_MANAGE', label: 'ثبت فیش‌های پرداختی، تخفیف‌ها و اقساط' },
    { id: 'EXPENSES_MANAGE', label: 'مدیریت و ثبت فاکتورهای هزینه‌های مدرسه' },
    { id: 'SCHOOL_SETTINGS_MANAGE', label: 'تغییر تنظیمات مدرسه و ربات بله' },
  ];

  const handleTogglePerm = (id: string) => {
    setSelectedPerms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    createCustomRole(roleName.trim(), roleDesc.trim(), selectedPerms);
    setIsModalOpen(false);
    setRoleName('');
    setRoleDesc('');
    setSelectedPerms([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="نقش‌ها و دسترسی‌های سازمانی"
        subtitle="بررسی مجوزهای نقش‌های پیش‌فرض و تعریف نقش‌های سفارشی مدرسه"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>تعریف نقش سفارشی</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{r.name}</h3>
                </div>
                {r.system ? (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">سیستمی</span>
                ) : (
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-medium">سفارشی</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-4">{r.description}</p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">مجوزهای دسترسی:</span>
              <div className="flex flex-wrap gap-1">
                {r.permissions.map(p => (
                  <span key={p} className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {p === 'ALL_PERMISSIONS' ? 'دسترسی نامحدود به کلیه بخش‌ها' : p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">تعریف نقش سازمانی جدید</h3>
            <p className="text-xs text-slate-500 mb-4">
              دسترسی‌ها و مسئولیت‌های این نقش را در مدرسه مشخص کنید.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان نقش *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: معاون آموزشی، مشاور تحصیلی"
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توضیحات کوتاه</label>
                <input
                  type="text"
                  placeholder="شرح وظایف این نقش در کادر مدرسه"
                  value={roleDesc}
                  onChange={e => setRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">انتخاب مجوزهای دسترسی:</label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-100 p-2 rounded-xl bg-slate-50">
                  {availablePermissions.map(perm => (
                    <label
                      key={perm.id}
                      onClick={() => handleTogglePerm(perm.id)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer transition text-xs text-slate-700"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedPerms.includes(perm.id) ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {selectedPerms.includes(perm.id) && <Check className="w-3 h-3" />}
                      </div>
                      <span>{perm.label}</span>
                    </label>
                  ))}
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
                  ذخیره نقش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
